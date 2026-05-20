// src/services/routeService.js
import { getMatrixData } from './routeMatrix';
const OSRM_BASE_URL = 'https://router.project-osrm.org';

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180, Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getTrafficMultiplier(timeString) {
    if (!timeString) return 1.0;
    const [hours, minutes] = timeString.split(':').map(Number);
    const time = hours + minutes / 60;

    // Matristeki veriler zaten ortalama İstanbul gündüz trafiğini (yoğunluğu) içeriyor.
    // Bu yüzden çarpanları çok daha gerçekçi ve yumuşak tutuyoruz.
    // Sabah Yoğunluğu (07:30 - 10:00)
    if (time >= 7.5 && time < 10) return 1.3;
    // Akşam Yoğunluğu (17:00 - 20:00)
    if (time >= 17 && time < 20) return 1.5;
    // Gün İçi (10:00 - 17:00) - Matrisin kendi doğal hali
    if (time >= 10 && time < 17) return 1.0;
    // Gece (20:00 - 07:30) - Trafik yok, yollar boş
    return 0.6;
}

// ═══════════════════════════════════════════════════════════
//  FERİBOT GEOMETRİSİ — Deniz üzerinden kıvrımlı yol
//  Düz çizgi yerine Bézier eğrisi ile deniz rotası çizer
// ═══════════════════════════════════════════════════════════

function generateFerryPath(fromLat, fromLng, toLat, toLng) {
    const dist = haversine(fromLat, fromLng, toLat, toLng);
    
    // Eğer mesafe çok kısaysa (örn. Salacak - Kız Kulesi arası 200-300m), düz çizgi çek. Devasa U dönüşü olmasın.
    if (dist < 1000) {
        return [[fromLat, fromLng], [toLat, toLng]];
    }

    // İstanbul'da deniz genel olarak güneyde (Marmara Denizi)
    const seaCenter = { lat: 40.70, lng: 29.00 };

    const midLat = (fromLat + toLat) / 2;
    const midLng = (fromLng + toLng) / 2;

    // Orta noktadan denize doğru yön vektörü
    let toSeaLat = seaCenter.lat - midLat;
    let toSeaLng = seaCenter.lng - midLng;

    // Özel durum: Kabataş (28.992) - Salacak (29.005) arası vapur hattı çizerken 
    // kavis Kız Kulesi'ne (güneyde) çarpmasın diye kavisi kuzeye (Boğaz'a) doğru verelim.
    if (dist < 4000 && ((fromLng < 29.0 && toLng > 29.0) || (fromLng > 29.0 && toLng < 29.0))) {
        toSeaLat = -toSeaLat;
        toSeaLng = -toSeaLng;
    }

    const toSeaLen = Math.sqrt(toSeaLat ** 2 + toSeaLng ** 2) || 1;

    // Kavis miktarını mesafenin %15'i kadar yap (kısa mesafelerde devasa U dönüşü olmaması için)
    const offset = Math.min((dist / 111000) * 0.15, 0.04); // maks ~4km kavis

    // Bézier kontrol noktası — denize doğru kaydırılmış orta nokta
    const ctrlLat = midLat + (toSeaLat / toSeaLen) * offset;
    const ctrlLng = midLng + (toSeaLng / toSeaLen) * offset;

    // Quadratic Bézier eğrisi: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
    const points = [];
    const N = 24;
    for (let i = 0; i <= N; i++) {
        const t = i / N;
        points.push([
            (1 - t) ** 2 * fromLat + 2 * (1 - t) * t * ctrlLat + t ** 2 * toLat,
            (1 - t) ** 2 * fromLng + 2 * (1 - t) * t * ctrlLng + t ** 2 * toLng,
        ]);
    }
    return points;
}

// ═══════════════════════════════════════════════════════════
//  OSRM API
// ═══════════════════════════════════════════════════════════

async function fetchDistanceMatrix(allPoints) {
    const coords = allPoints.map(p => `${p.lng},${p.lat}`).join(';');
    const url = `${OSRM_BASE_URL}/table/v1/driving/${coords}?annotations=distance,duration`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM Table: ${res.status}`);
    const data = await res.json();
    if (data.code !== 'Ok') throw new Error(`OSRM Table: ${data.code}`);
    return { distances: data.distances, durations: data.durations };
}

async function fetchOSRMRoute(from, to, profile = 'driving') {
    const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
    const url = `${OSRM_BASE_URL}/route/v1/${profile}/${coords}?overview=full&geometries=geojson&steps=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM Route (${profile}): ${res.status}`);
    const data = await res.json();
    if (data.code !== 'Ok') throw new Error(`OSRM Route (${profile}): ${data.code}`);

    const route = data.routes[0];
    const waypoints = data.waypoints || [];

    // Snap mesafeleri
    let fromSnap = 0, toSnap = 0;
    if (waypoints.length >= 2) {
        const [sLng, sLat] = waypoints[0].location;
        const [eLng, eLat] = waypoints[1].location;
        fromSnap = haversine(from.lat, from.lng, sLat, sLng);
        toSnap = haversine(to.lat, to.lng, eLat, eLng);
    }

    let geometry = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const firstPt = geometry[0];
    if (firstPt && haversine(from.lat, from.lng, firstPt[0], firstPt[1]) > 10)
        geometry = [[from.lat, from.lng], ...geometry];
    const lastPt = geometry[geometry.length - 1];
    if (lastPt && haversine(to.lat, to.lng, lastPt[0], lastPt[1]) > 10)
        geometry = [...geometry, [to.lat, to.lng]];

    return { geometry, distance: route.distance, duration: route.duration, fromSnap, toSnap };
}

// ═══════════════════════════════════════════════════════════
//  MATRİS — null'ları haversine ile doldur
// ═══════════════════════════════════════════════════════════

function buildCompleteMatrix(allPoints, trafficMultiplier) {
    const n = allPoints.length;
    const m = Array.from({ length: n }, () => new Float64Array(n));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) {
                m[i][j] = 0;
            } else {
                const data = getMatrixData(allPoints[i].id, allPoints[j].id);
                // Artık süreler gerçek İstanbul trafiğini yansıttığı için (darboğazlar ve 12km/s hızlar dahil),
                // TSP'yi tekrar 'duration' (zaman) üzerinden hesaplamak en doğru sıralamayı verecektir.
                let dur = data ? data.duration : (haversine(allPoints[i].lat, allPoints[i].lng, allPoints[j].lat, allPoints[j].lng) * 3);
                
                // Eğer data varsa ve mode driving ise, trafik çarpanı uygula.
                // Fallback için zaten düz mesafeyi 3 ile çarptık ki o da kötü bir fallback, 
                // ama genelde fallback driving varsayılır, ona da uygula.
                if (!data || data.mode === 'driving') {
                    dur *= trafficMultiplier;
                }
                
                m[i][j] = dur;
            }
        }
    }
    return m;
}

// ═══════════════════════════════════════════════════════════
//  TSP
// ═══════════════════════════════════════════════════════════

function solveNN(dist, n) {
    if (n <= 1) return n === 1 ? [0] : [];
    const tot = n + 1, vis = new Array(tot).fill(false);
    vis[0] = true;
    const order = [];
    let cur = 0;
    for (let s = 0; s < n; s++) {
        let bj = -1, bd = Infinity;
        for (let j = 1; j < tot; j++) if (!vis[j] && dist[cur][j] < bd) { bd = dist[cur][j]; bj = j; }
        if (bj === -1) break;
        vis[bj] = true; order.push(bj - 1); cur = bj;
    }
    for (let j = 1; j < tot; j++) if (!vis[j]) order.push(j - 1);
    return order;
}

function solveHK(dist, n) {
    if (n <= 1) return n === 1 ? [0] : [];
    if (n === 2) return dist[0][1] <= dist[0][2] ? [0, 1] : [1, 0];
    const F = (1 << n) - 1;
    const dp = Array.from({ length: F + 1 }, () => new Float64Array(n).fill(Infinity));
    const pr = Array.from({ length: F + 1 }, () => new Int8Array(n).fill(-1));
    for (let i = 0; i < n; i++) { const d = dist[0][i + 1]; if (isFinite(d)) dp[1 << i][i] = d; }
    for (let m = 1; m <= F; m++)
        for (let l = 0; l < n; l++) {
            if (!(m & (1 << l)) || dp[m][l] === Infinity) continue;
            for (let x = 0; x < n; x++) {
                if (m & (1 << x)) continue;
                const d = dist[l + 1][x + 1];
                if (!isFinite(d)) continue;
                const nm = m | (1 << x), nd = dp[m][l] + d;
                if (nd < dp[nm][x]) { dp[nm][x] = nd; pr[nm][x] = l; }
            }
        }
    let b = 0;
    for (let i = 1; i < n; i++) if (dp[F][i] < dp[F][b]) b = i;
    if (dp[F][b] === Infinity) return solveNN(dist, n);
    const path = [];
    let mask = F, node = b;
    while (node !== -1) { path.push(node); const p = pr[mask][node]; mask ^= (1 << node); node = p; }
    path.reverse();
    return path;
}

// ═══════════════════════════════════════════════════════════
//  ADA / DENİZ NOKTASI VERİTABANI VE İSKELELER
// ═══════════════════════════════════════════════════════════

const ISLAND_PORTS = {
    6: { id: 'port_6', title: "Salacak İskelesi", lat: 41.0225, lng: 29.0055 }, // Kız Kulesi İskelesi
    9: { id: 'port_9', title: "Kabataş İskelesi", lat: 41.0315, lng: 28.9925 }, // Büyükada için Kabataş İskelesi
    12: { id: 'port_9', title: "Kabataş İskelesi", lat: 41.0315, lng: 28.9925 } // Heybeliada için Kabataş İskelesi
};

function isIslandPoint(point) {
    return ISLAND_PORTS[point.id] !== undefined;
}

function getEffectivePoint(point) {
    return isIslandPoint(point) ? ISLAND_PORTS[point.id] : point;
}

// ═══════════════════════════════════════════════════════════
//  SEGMENT ROTALAMA
// ═══════════════════════════════════════════════════════════

const SNAP_THRESHOLD = 800;

// İki nokta arası temel rotalama (araba, yürüme veya direkt feribot)
async function getPrimitiveSegment(from, to, forceFerry = false, trafficMultiplier = 1.0) {
    const fromTitle = from.title || 'Nokta';
    const toTitle = to.title || 'Nokta';
    let matrixData = getMatrixData(from.id, to.id);

    // Eğer zorla vapur geçişi isteniyorsa AMA matris bize karayolu (driving/mixed) döndürdüyse,
    // (Örn: Kabataş - Salacak arası geçişte Taksim-KızKulesi araç verisinin gelmesi)
    // matris verisini yoksayıp gerçek deniz mesafesini hesaplamalıyız.
    if (forceFerry && matrixData && matrixData.mode !== 'ferry') {
        matrixData = null;
    }

    if (!matrixData) {
        const straightDist = haversine(from.lat, from.lng, to.lat, to.lng);
        if (forceFerry) {
            // Şehir hatları feribotları ortalama 15-18 km/s hızla gider (yaklaşık 4.5 m/s)
            // İskelelerdeki bekleme/kalkış payı için +300 saniye (5 dk) ekliyoruz.
            const ferryDist = straightDist * 1.1; // Deniz yolu kavisli olabilir
            const ferryDuration = (ferryDist / 4.5) + 300; // Süre saniye cinsinden
            matrixData = { mode: 'ferry', distance: ferryDist, duration: ferryDuration };
        } else {
            // Araç veya yürüme için tahmini fallback
            matrixData = { mode: 'driving', distance: straightDist * 1.5, duration: (straightDist * 1.5) / 8 }; // Ort. 30 km/s hız
        }
    }

    let duration = matrixData.duration;
    if (matrixData.mode === 'driving' || matrixData.mode === 'mixed') {
        duration *= trafficMultiplier;
    }

    if (forceFerry || matrixData.mode === 'ferry') {
        console.log(`[Rota] ⛴️ ${fromTitle} → ${toTitle}: Yerel Matris (Feribot)`);
        return {
            mode: 'ferry', fromTitle, toTitle,
            geometry: generateFerryPath(from.lat, from.lng, to.lat, to.lng),
            distance: matrixData.distance,
            duration: duration
        };
    }

    if (matrixData.mode === 'walking') {
        console.log(`[Rota] 🚶 ${fromTitle} → ${toTitle}: Yerel Matris (Yürüme - Düz Çizgi)`);
        return {
            mode: 'walking', fromTitle, toTitle,
            geometry: [[from.lat, from.lng], [to.lat, to.lng]],
            distance: matrixData.distance,
            duration: duration
        };
    }

    // Geri kalanlar (araba) için OSRM'den SADECE yol geometrisini alıyoruz
    try {
        const drive = await fetchOSRMRoute(from, to, 'driving');
        console.log(`[Rota] 🚗 ${fromTitle} → ${toTitle}: Yerel Matris Süresi + OSRM Çizgisi (Çarpan: ${trafficMultiplier})`);
        return {
            mode: 'driving', fromTitle, toTitle,
            geometry: drive.geometry, 
            distance: matrixData.distance, // Süre/mesafe matristen veya fallback
            duration: duration
        };
    } catch (e) {
        console.log(`[Rota] 🚗 OSRM başarısız, düz çizgi çekiliyor.`);
        return {
            mode: 'driving', fromTitle, toTitle,
            geometry: [[from.lat, from.lng], [to.lat, to.lng]],
            distance: matrixData.distance,
            duration: duration
        };
    }
}

// Ana segment oluşturucu: Gerekirse iskele (port) üzerinden böler
async function routeSegment(from, to, trafficMultiplier) {
    const isFromIsland = isIslandPoint(from);
    const isToIsland = isIslandPoint(to);
    let subs = [];
    const EUROPEAN_IDS = [1, 2, 3, 4, 5, 7, 8, 10, 13];

    if (isFromIsland && !isToIsland) {
        const port = ISLAND_PORTS[from.id];
        subs.push(await getPrimitiveSegment(from, port, true, trafficMultiplier)); // Ada -> İskele (Vapur)

        // Eğer iskele Salacak (port_6) ise ve hedef Avrupa'da ise, Kabataş (port_9) üzerinden vapurla geç
        if (port.id === 'port_6' && EUROPEAN_IDS.includes(to.id)) {
            const kabatas = ISLAND_PORTS[9];
            subs.push(await getPrimitiveSegment(port, kabatas, true, trafficMultiplier)); // Salacak -> Kabataş (Vapur)
            subs.push(await getPrimitiveSegment(kabatas, to, false, trafficMultiplier));  // Kabataş -> Avrupa Hedef
        } else {
            subs.push(await getPrimitiveSegment(port, to, false, trafficMultiplier));  // İskele -> Hedef
        }
    } else if (!isFromIsland && isToIsland) {
        const port = ISLAND_PORTS[to.id];
        
        // Eğer kaynak Avrupa'da ise ve hedef iskele Salacak (port_6) ise, Kabataş (port_9) üzerinden vapurla geç
        if (EUROPEAN_IDS.includes(from.id) && port.id === 'port_6') {
            const kabatas = ISLAND_PORTS[9];
            subs.push(await getPrimitiveSegment(from, kabatas, false, trafficMultiplier)); // Avrupa Kaynak -> Kabataş
            subs.push(await getPrimitiveSegment(kabatas, port, true, trafficMultiplier));  // Kabataş -> Salacak (Vapur)
        } else {
            subs.push(await getPrimitiveSegment(from, port, false, trafficMultiplier)); // Kaynak -> İskele
        }

        subs.push(await getPrimitiveSegment(port, to, true, trafficMultiplier));    // İskele -> Ada (Vapur)
    } else if (isFromIsland && isToIsland) {
        const fId = String(from.id);
        const tId = String(to.id);
        // Eğer iki ada arasında direkt sefer varsa (örn. Büyükada - Heybeliada), direkt feribot yap.
        if ((fId === '9' && tId === '12') || (fId === '12' && tId === '9')) {
            subs.push(await getPrimitiveSegment(from, to, true, trafficMultiplier)); // Ada -> Ada (Direkt feribot)
        } else {
            // Birbiriyle doğrudan bağlantısı olmayan adalar (örn. Kız Kulesi - Büyükada)
            const portFrom = ISLAND_PORTS[from.id];
            const portTo = ISLAND_PORTS[to.id];
            subs.push(await getPrimitiveSegment(from, portFrom, true, trafficMultiplier)); // 1. Ada -> 1. İskele
            
            if (portFrom.id !== portTo.id) {
                // İskeleler arası (Kabataş - Salacak) ise aracı vapur yap
                if ((portFrom.id === 'port_6' && portTo.id === 'port_9') || (portFrom.id === 'port_9' && portTo.id === 'port_6')) {
                    subs.push(await getPrimitiveSegment(portFrom, portTo, true, trafficMultiplier)); // İskele -> İskele (Vapur)
                } else {
                    subs.push(await getPrimitiveSegment(portFrom, portTo, false, trafficMultiplier)); // 1. İskele -> 2. İskele (Kara)
                }
            }
            subs.push(await getPrimitiveSegment(portTo, to, true, trafficMultiplier));    // 2. İskele -> 2. Ada
        }
    } else {
        subs.push(await getPrimitiveSegment(from, to, false, trafficMultiplier)); // Normal rota
    }

    return {
        from, to,
        subSegments: subs,
        distance: subs.reduce((s, x) => s + x.distance, 0),
        duration: subs.reduce((s, x) => s + x.duration, 0),
        mode: subs.length === 1 ? subs[0].mode : 'mixed',
        geometry: subs.flatMap(s => s.geometry)
    };
}

// ═══════════════════════════════════════════════════════════
//  ANA FONKSİYON
// ═══════════════════════════════════════════════════════════

export async function calculateOptimalRoute(startPoint, stops, startTime = '10:00') {
    if (stops.length === 0) return { orderedStops: [], segments: [], totalDistance: 0, totalDuration: 0 };

    const trafficMultiplier = getTrafficMultiplier(startTime);
    console.log(`[Trafik] Başlangıç Saati: ${startTime}, Çarpan: ${trafficMultiplier}x`);

    let orderedStops;
    if (stops.length === 1) {
        orderedStops = [...stops];
    } else {
        const allPoints = [startPoint, ...stops];
        // TSP için adaların iskele koordinatlarını (effective points) kullanıyoruz
        const effectivePoints = allPoints.map(getEffectivePoint);
        const matrix = buildCompleteMatrix(effectivePoints, trafficMultiplier);
        const order = stops.length <= 15 ? solveHK(matrix, stops.length) : solveNN(matrix, stops.length);
        orderedStops = order.map(i => stops[i]);
        console.log('[Rota] Sıralama:', orderedStops.map(s => s.title).join(' → '));
    }

    const waypoints = [startPoint, ...orderedStops];
    const segments = [];
    for (let i = 0; i < waypoints.length - 1; i++)
        segments.push(await routeSegment(waypoints[i], waypoints[i + 1], trafficMultiplier));

    return {
        orderedStops, segments,
        totalDistance: segments.reduce((s, x) => s + x.distance, 0),
        totalDuration: segments.reduce((s, x) => s + x.duration, 0),
    };
}
