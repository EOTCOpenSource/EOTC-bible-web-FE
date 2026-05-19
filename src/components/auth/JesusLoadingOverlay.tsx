'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const SCENE_DURATION = 4400

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    fn() // set initial value on mount
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

const scenes = [
  {
    id: 'birth',
    amharic: 'ልደቱ',
    english: 'His Birth',
    verse: 'Isaiah 9:6',
    verseText: 'For unto us a Child is born, unto us a Son is given',
    accent: '#c8a050',
    tint: 'rgba(40,25,5,0.55)',
  },
  {
    id: 'baptism',
    amharic: 'ጥምቀቱ',
    english: 'His Baptism',
    verse: 'Matthew 3:17',
    verseText: 'This is my beloved Son, in whom I am well pleased',
    accent: '#8ab4d0',
    tint: 'rgba(5,15,30,0.55)',
  },
  {
    id: 'ministry',
    amharic: 'አገልግሎቱ',
    english: 'His Ministry',
    verse: 'Matthew 14:27',
    verseText: 'Take courage! It is I. Do not be afraid.',
    accent: '#d0c8a0',
    tint: 'rgba(5,10,20,0.6)',
  },
  {
    id: 'crucifixion',
    amharic: 'ስቅለቱ',
    english: 'His Crucifixion',
    verse: 'John 19:30',
    verseText: 'It is finished',
    accent: '#9a2010',
    tint: 'rgba(20,0,0,0.65)',
  },
  {
    id: 'resurrection',
    amharic: 'ትንሣኤው',
    english: 'His Resurrection',
    verse: 'Matthew 28:6',
    verseText: 'He is not here — He has risen, just as He said',
    accent: '#e8c840',
    tint: 'rgba(10,8,0,0.4)',
  },
]

// ── Birth ──────────────────────────────────────────────────
function BirthScene({ accent, isMobile = false }: { accent: string; isMobile?: boolean }) {
  return (
    <svg
      viewBox="0 0 500 700"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    >
      <defs>
        <filter id="birth-rough">
          {isMobile ? (
            <feOffset dx="0" dy="0" />
          ) : (
            <>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04 0.06"
                numOctaves={4}
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={6}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </>
          )}
        </filter>
        <filter id="birth-glow">
          <feGaussianBlur stdDeviation={isMobile ? 4 : 8} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="bstar" cx="50%" cy="18%" r="32%">
          <stop offset="0%" stopColor="#fffbe0" stopOpacity="1" />
          <stop offset="30%" stopColor={accent} stopOpacity="0.7" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bmangerlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050410" />
          <stop offset="60%" stopColor="#0a0818" />
          <stop offset="100%" stopColor="#120a05" />
        </linearGradient>
      </defs>

      <rect width="500" height="700" fill="url(#bsky)" />

      {/* Atmospheric haze */}
      <ellipse cx="250" cy="130" rx="280" ry="180" fill={accent} opacity="0.04" />

      {/* Scattered stars — irregular sizes, sepia-tinted */}
      {(isMobile
        ? [
            [38, 55, 1.4],
            [160, 48, 1.1],
            [295, 22, 1.6],
            [345, 130, 0.8],
            [108, 88, 0.7],
            [265, 40, 1.2],
            [228, 35, 1.5],
            [430, 95, 1],
          ]
        : [
            [38, 55, 1.4],
            [88, 30, 0.9],
            [160, 48, 1.1],
            [295, 22, 1.6],
            [368, 72, 1],
            [345, 130, 0.8],
            [22, 120, 1.3],
            [108, 88, 0.7],
            [318, 54, 0.9],
            [15, 178, 1.1],
            [392, 158, 0.6],
            [265, 40, 1.2],
            [185, 68, 0.8],
            [228, 35, 1.5],
            [70, 160, 0.7],
            [430, 95, 1],
            [145, 22, 0.9],
            [468, 55, 0.7],
            [335, 168, 1.3],
            [54, 200, 0.8],
          ]
      ).map(([x, y, r], i) =>
        isMobile ? (
          <circle key={i} cx={x} cy={y} r={r} fill="#e8d8b0" opacity={0.3 + (i % 6) * 0.09} />
        ) : (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="#e8d8b0"
            opacity={0.3 + (i % 6) * 0.09}
            animate={{
              opacity: [0.15 + (i % 3) * 0.1, 0.6 + (i % 4) * 0.08, 0.15 + (i % 3) * 0.1],
            }}
            transition={{ duration: 1.5 + (i % 5) * 0.4, repeat: Infinity, delay: i * 0.15 }}
          />
        ),
      )}

      {/* Star of Bethlehem — rough filter, organic glow */}
      <g filter="url(#birth-glow)">
        <motion.g
          animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.8, repeat: Infinity }}
          style={{ transformOrigin: '250px 127px' }}
        >
          <polygon points="250,72 256,115 250,162 244,115" fill={accent} opacity="0.95" />
          <polygon points="198,127 244,133 302,127 244,121" fill={accent} opacity="0.95" />
          <polygon points="214,86 243,115 282,154 253,125" fill={accent} opacity="0.7" />
          <polygon points="286,86 257,115 218,154 247,125" fill={accent} opacity="0.7" />
          <circle cx="250" cy="127" r="16" fill="#fffde8" opacity="0.95" />
        </motion.g>
      </g>

      {/* Light shaft — rough displacement */}
      <motion.polygon
        points="243,143 257,143 278,700 222,700"
        fill={accent}
        opacity="0.06"
        animate={{ opacity: [0.03, 0.09, 0.03] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        filter="url(#birth-rough)"
      />

      {/* Rocky landscape — organic, jagged */}
      <path
        d="M0,520 Q40,478 95,490 Q145,502 195,468 Q240,448 285,462 Q335,478 385,445 Q420,430 460,448 Q480,456 500,445 L500,700 L0,700Z"
        fill="#0c0805"
        filter="url(#birth-rough)"
      />
      <path
        d="M0,560 Q55,535 110,548 Q180,564 250,542 Q320,522 390,545 Q440,558 500,540 L500,700 L0,700Z"
        fill="#08060300"
        filter="url(#birth-rough)"
      />
      <path
        d="M0,580 Q70,565 140,575 Q210,585 280,568 Q355,552 430,568 Q465,575 500,562 L500,700 L0,700Z"
        fill="#060402"
      />

      {/* Manger glow */}
      <motion.ellipse
        cx="250"
        cy="545"
        rx="60"
        ry="40"
        fill="url(#bmangerlight)"
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Stable silhouette — dark, irregular */}
      <g filter="url(#birth-rough)">
        <polygon points="168,540 250,460 332,540" fill="#060402" />
        <rect x="172" y="540" width="156" height="120" fill="#050301" />
        <rect x="200" y="560" width="22" height="100" fill="#040200" />
        <rect x="280" y="572" width="20" height="88" fill="#040200" />
      </g>

      {/* Manger cradle */}
      <g transform="translate(250,578)">
        <path
          d="M-30,0 Q0,-20 30,0 L24,52 Q0,62 -24,52Z"
          fill="#0a0601"
          filter="url(#birth-rough)"
        />
        <motion.ellipse
          cx="0"
          cy="30"
          rx="18"
          ry="11"
          fill={accent}
          opacity="0.4"
          animate={{ opacity: [0.22, 0.55, 0.22] }}
          transition={{ duration: 2.8, repeat: Infinity }}
        />
        {/* Infant Jesus — wrapped, glowing */}
        <motion.ellipse
          cx="0"
          cy="26"
          rx="11"
          ry="8"
          fill="#fffde0"
          opacity="0.7"
          animate={{ opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </g>

      {/* ── SAINTS: Mary, Joseph, Wise Men ── brightness-lifted so they pop on dark bg */}
      <g style={{ filter: 'brightness(8) sepia(0.5) contrast(1.1)' }}>
        {/* ── SAINT MARY ── kneeling left of manger, veil draped over head */}
        <g filter="url(#birth-rough)">
          {/* Head with maphorion veil */}
          <ellipse cx="188" cy="528" rx="13" ry="14" fill="#0e0908" />
          {/* Veil flowing over head and shoulders — teardrop shape */}
          <path
            d="M175,520 Q188,508 201,520 Q210,538 205,565 Q188,572 171,565 Q166,538 175,520Z"
            fill="#0c0806"
            opacity="0.92"
          />
          {/* Face hint — lighter oval inside veil */}
          <ellipse cx="188" cy="530" rx="8" ry="9" fill="#18100c" opacity="0.85" />
          {/* Body — kneeling, robes pooling on ground */}
          <path
            d="M178,542 Q168,558 165,590 Q180,598 200,595 Q210,572 205,545Z"
            fill="#0d0807"
            filter="url(#birth-rough)"
          />
          {/* Arms raised in adoration toward manger */}
          <path
            d="M178,548 Q165,542 158,535"
            stroke="#0e0908"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M200,548 Q212,542 220,537"
            stroke="#0e0908"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          {/* Knees on ground */}
          <ellipse cx="182" cy="592" rx="12" ry="5" fill="#0c0706" opacity="0.7" />
          <ellipse cx="200" cy="595" rx="10" ry="4" fill="#0c0706" opacity="0.7" />
        </g>

        {/* ── SAINT JOSEPH ── standing right of manger, staff, beard */}
        <g filter="url(#birth-rough)">
          {/* Head */}
          <circle cx="318" cy="508" r="15" fill="#0e0908" />
          {/* Beard — extended chin */}
          <ellipse cx="318" cy="522" rx="9" ry="7" fill="#0c0706" />
          {/* Tall robe / body */}
          <path
            d="M305,522 Q298,548 296,600 Q318,608 340,600 Q338,548 331,522Z"
            fill="#0d0807"
            filter="url(#birth-rough)"
          />
          {/* Outer mantle draped over shoulder */}
          <path
            d="M305,526 Q285,545 282,585 Q296,592 305,575 Q310,558 310,540Z"
            fill="#0b0706"
            opacity="0.8"
          />
          {/* Staff — tall walking stick */}
          <line
            x1="295"
            y1="508"
            x2="278"
            y2="640"
            stroke="#090604"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* One hand on staff */}
          <ellipse cx="285" cy="535" rx="7" ry="5" fill="#0e0908" opacity="0.8" />
          {/* Looking down toward manger — head tilt suggested by body lean */}
        </g>

        {/* Three wise men — rough, organic silhouettes, further back */}
        {[
          [390, 500, 0.95],
          [418, 506, 0.85],
          [448, 496, 1.0],
        ].map(([tx, ty, s], i) => (
          <g
            key={i}
            transform={`translate(${tx},${ty}) scale(${s})`}
            opacity={0.65 - i * 0.08}
            filter="url(#birth-rough)"
          >
            {/* Head with turban/crown */}
            <ellipse cx="0" cy="0" rx="10" ry="12" fill="#060402" />
            <ellipse cx="0" cy="-8" rx="12" ry="6" fill="#060402" opacity="0.8" />
            {/* Robe body */}
            <path d="M-10,10 Q-15,30 -11,52 Q0,60 11,52 Q15,30 10,10Z" fill="#060402" />
            {/* Arm bearing gift */}
            <path
              d="M-10,14 Q-24,22 -20,36"
              stroke="#060402"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M10,14 Q20,18 16,28"
              stroke="#060402"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            {/* Gift box */}
            {i === 0 && <rect x="-20" y="30" width="10" height="10" fill="#060402" opacity="0.7" />}
            {/* Camel behind last wise man */}
            {i === 2 && (
              <>
                <ellipse cx="32" cy="42" rx="20" ry="11" fill="#050301" opacity="0.65" />
                <ellipse cx="42" cy="32" rx="8" ry="12" fill="#050301" opacity="0.6" />
                <line x1="22" y1="50" x2="20" y2="70" stroke="#050301" strokeWidth="4" />
                <line x1="40" y1="52" x2="38" y2="70" stroke="#050301" strokeWidth="4" />
              </>
            )}
          </g>
        ))}
      </g>
      {/* end brightness wrapper */}
    </svg>
  )
}

// ── Baptism ────────────────────────────────────────────────
function BaptismScene({ accent, isMobile = false }: { accent: string; isMobile?: boolean }) {
  return (
    <svg
      viewBox="0 0 500 700"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    >
      <defs>
        <filter id="bap-rough">
          {isMobile ? (
            <feOffset dx="0" dy="0" />
          ) : (
            <>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.035 0.05"
                numOctaves={3}
                result="n"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="n"
                scale={8}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </>
          )}
        </filter>
        <filter id="bap-blur">
          <feGaussianBlur stdDeviation={isMobile ? 5 : 10} />
        </filter>
        <radialGradient id="baplight" cx="50%" cy="22%" r="42%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bapwater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#081828" />
          <stop offset="100%" stopColor="#030c16" />
        </linearGradient>
        <linearGradient id="bapsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#04101e" />
          <stop offset="100%" stopColor="#081828" />
        </linearGradient>
      </defs>

      <rect width="500" height="700" fill="url(#bapsky)" />

      {/* Overcast cloud mass */}
      <ellipse
        cx="250"
        cy="80"
        rx="320"
        ry="130"
        fill="#060e18"
        opacity="0.9"
        filter="url(#bap-rough)"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="160"
        ry="80"
        fill="#050c15"
        opacity="0.85"
        filter="url(#bap-rough)"
      />
      <ellipse
        cx="400"
        cy="110"
        rx="140"
        ry="70"
        fill="#050c15"
        opacity="0.85"
        filter="url(#bap-rough)"
      />

      {/* Divine light — opening in clouds */}
      <ellipse cx="250" cy="150" rx="180" ry="200" fill="url(#baplight)" filter="url(#bap-blur)" />
      <motion.ellipse
        cx="250"
        cy="145"
        rx="180"
        ry="195"
        fill="url(#baplight)"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      />

      {/* Light beam shafts */}
      {[-30, -12, 0, 12, 30].map((dx, i) => (
        <motion.polygon
          key={i}
          points={`${245 + dx},100 ${255 + dx},100 ${275 + dx + i * 8},700 ${225 + dx - i * 8},700`}
          fill="white"
          opacity={0.025 - i * 0.002}
          animate={{ opacity: [0.01, 0.04, 0.01] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* Dove — organic, hand-etched feel */}
      <motion.g
        animate={{ y: [0, 10, 0], x: [0, 3, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <g filter="url(#bap-rough)">
          {/* Wings */}
          <path
            d="M250,148 Q228,136 205,148 Q222,142 250,158 Q278,142 295,148 Q272,136 250,148Z"
            fill="#e8e8e0"
            opacity="0.9"
          />
          {/* Body */}
          <ellipse cx="250" cy="163" rx="11" ry="18" fill="#ddddd5" opacity="0.92" />
          {/* Tail */}
          <path d="M250,178 Q245,188 250,196 Q255,188 250,178Z" fill="#ddddd5" opacity="0.85" />
          {/* Head */}
          <circle cx="250" cy="146" r="8" fill="#ddddd5" opacity="0.9" />
        </g>
      </motion.g>

      {/* Jordan river */}
      <rect x="0" y="470" width="500" height="230" fill="url(#bapwater)" />

      {/* Rough water surface ripples */}
      {(isMobile ? [470, 505] : [470, 488, 505, 520]).map((y, i) =>
        isMobile ? (
          <path
            key={i}
            d={`M0,${y} Q62,${y - 7} 125,${y} Q187,${y + 7} 250,${y} Q312,${y - 7} 375,${y} Q437,${y + 7} 500,${y}`}
            fill="none"
            stroke={accent}
            strokeWidth="1"
            opacity={0.12 + i * 0.04}
          />
        ) : (
          <motion.path
            key={i}
            d={`M0,${y} Q62,${y - 7} 125,${y} Q187,${y + 7} 250,${y} Q312,${y - 7} 375,${y} Q437,${y + 7} 500,${y}`}
            fill="none"
            stroke={accent}
            strokeWidth="1"
            opacity={0.12 + i * 0.04}
            animate={{
              d: [
                `M0,${y} Q62,${y - 7} 125,${y} Q187,${y + 7} 250,${y} Q312,${y - 7} 375,${y} Q437,${y + 7} 500,${y}`,
                `M0,${y} Q62,${y + 7} 125,${y} Q187,${y - 7} 250,${y} Q312,${y + 7} 375,${y} Q437,${y - 7} 500,${y}`,
                `M0,${y} Q62,${y - 7} 125,${y} Q187,${y + 7} 250,${y} Q312,${y - 7} 375,${y} Q437,${y + 7} 500,${y}`,
              ],
            }}
            transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ),
      )}

      {/* ── ALL FIGURES ── brightness-lifted for visibility */}
      <g style={{ filter: 'brightness(9) sepia(0.4) contrast(1.1)' }}>
        {/* ── JESUS ── standing in Jordan, waist-deep */}
        <g filter="url(#bap-rough)">
          <circle cx="255" cy="375" r="19" fill="#03090f" />
          <rect x="244" y="392" width="22" height="80" rx="11" fill="#030810" />
          {/* Arms slightly raised, receiving baptism */}
          <path
            d="M244,410 Q230,418 225,430"
            stroke="#030810"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M266,410 Q275,416 278,428"
            stroke="#030810"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="255" cy="472" rx="26" ry="6" fill="#060f1c" opacity="0.7" />
        </g>

        {/* ── JOHN THE BAPTIST ── beside Jesus, arm raised pouring water */}
        <g filter="url(#bap-rough)">
          {/* Head — rough hair */}
          <circle cx="310" cy="372" r="17" fill="#03090f" />
          {/* Wild hair suggestion — irregular halo */}
          <path
            d="M294,364 Q298,352 310,350 Q322,352 326,364 Q332,358 328,348 Q316,338 304,340 Q292,344 288,356Z"
            fill="#020708"
            opacity="0.9"
          />
          {/* Camel-hair rough garment — uneven robe */}
          <path
            d="M295,388 Q288,408 285,450 Q298,462 322,458 Q328,418 325,388Z"
            fill="#030a10"
            filter="url(#bap-rough)"
          />
          {/* Leather belt suggestion */}
          <rect x="287" y="412" width="38" height="5" fill="#020607" rx="2" opacity="0.75" />
          {/* Arm raised high — pouring water over Jesus' head */}
          <path
            d="M323,390 Q338,368 340,348"
            stroke="#03090f"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
          {/* Shell/bowl at top of raised arm */}
          <ellipse cx="340" cy="345" rx="10" ry="6" fill="#030a10" opacity="0.9" />
          {/* Water droplets falling */}
          {[0, 1, 2].map((i) => (
            <motion.ellipse
              key={i}
              cx={330 - i * 4}
              cy={355 + i * 10}
              rx="2"
              ry="3"
              fill={accent}
              opacity="0.35"
              animate={{ cy: [355 + i * 10, 370 + i * 10], opacity: [0.4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25 }}
            />
          ))}
          {/* Staff leaning beside him */}
          <line
            x1="285"
            y1="372"
            x2="272"
            y2="500"
            stroke="#020708"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Legs/feet in water */}
          <path
            d="M295,450 Q290,465 292,478"
            stroke="#030a10"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M318,450 Q322,465 320,478"
            stroke="#030a10"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="308" cy="476" rx="20" ry="5" fill="#060f1c" opacity="0.6" />
        </g>

        {/* Riverbanks — thick organic masses */}
        <path
          d="M0,510 Q100,475 220,490 L220,700 L0,700Z"
          fill="#03070e"
          filter="url(#bap-rough)"
        />
        <path
          d="M500,505 Q400,470 280,485 L280,700 L500,700Z"
          fill="#03070e"
          filter="url(#bap-rough)"
        />

        {/* ── CROWD ON BANK ── witnessing, varied heights */}
        {[
          [38, 490],
          [62, 482],
          [80, 488],
          [130, 478],
          [155, 484],
          [172, 479],
          [385, 482],
          [408, 488],
          [428, 476],
          [455, 483],
        ].map(([x, y], i) => (
          <g key={i} filter="url(#bap-rough)" opacity={0.6 - (i % 3) * 0.1}>
            <circle cx={x} cy={y} r={6 + (i % 3)} fill="#020608" />
            <path
              d={`M${x},${y + 6} Q${x - 6},${y + 22} ${x - 3},${y + 40}`}
              stroke="#020608"
              strokeWidth={6 + (i % 2)}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M${x},${y + 6} Q${x + 6},${y + 18} ${x + 3},${y + 32}`}
              stroke="#020608"
              strokeWidth={5 + (i % 2)}
              fill="none"
              strokeLinecap="round"
            />
            {/* Head covering on some */}
            {i % 3 === 0 && (
              <ellipse cx={x} cy={y - 4} rx={8} ry={4} fill="#020608" opacity="0.8" />
            )}
          </g>
        ))}

        {/* Trees on bank — rough silhouettes */}
        {[
          [55, 470],
          [90, 455],
          [420, 464],
          [452, 450],
        ].map(([x, y], i) => (
          <g key={i} filter="url(#bap-rough)">
            <rect x={x - 4} y={y} width="8" height="55" fill="#020608" />
            <ellipse cx={x} cy={y} rx={24 - (i % 3) * 4} ry={32 - (i % 2) * 8} fill="#020608" />
          </g>
        ))}
      </g>
      {/* end brightness wrapper */}
    </svg>
  )
}

// ── Ministry ───────────────────────────────────────────────
function MinistryScene({ accent, isMobile = false }: { accent: string; isMobile?: boolean }) {
  return (
    <svg
      viewBox="0 0 500 700"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    >
      <defs>
        <filter id="min-rough">
          {isMobile ? (
            <feOffset dx="0" dy="0" />
          ) : (
            <>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04 0.07"
                numOctaves={4}
                result="n"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="n"
                scale={10}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </>
          )}
        </filter>
        <filter id="min-glow">
          <feGaussianBlur stdDeviation={isMobile ? 6 : 12} />
        </filter>
        <radialGradient id="moonhalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="minsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020509" />
          <stop offset="100%" stopColor="#060b10" />
        </linearGradient>
      </defs>

      <rect width="500" height="700" fill="url(#minsky)" />

      {/* Moon through storm — hazy, diffused */}
      <ellipse
        cx="380"
        cy="90"
        rx="55"
        ry="50"
        fill={accent}
        opacity="0.12"
        filter="url(#min-glow)"
      />
      <ellipse
        cx="380"
        cy="90"
        rx="38"
        ry="35"
        fill={accent}
        opacity="0.22"
        filter="url(#min-glow)"
      />
      <motion.circle
        cx="380"
        cy="90"
        r="26"
        fill="#b0c8e0"
        opacity="0.6"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />

      {/* Moon reflection streak on water */}
      <motion.polygon
        points="358,340 402,340 360,700 335,700"
        fill={accent}
        opacity="0.05"
        animate={{ opacity: [0.02, 0.07, 0.02] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />

      {/* Thick storm clouds — layered, rough */}
      {[
        [60, 80, 120, 55],
        [180, 55, 140, 48],
        [300, 68, 120, 45],
        [70, 118, 100, 38],
        [230, 100, 90, 35],
        [380, 85, 110, 42],
        [450, 130, 80, 30],
        [10, 145, 90, 32],
      ].map(([cx, cy, rx, ry], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="#050810"
          opacity={0.85 + (i % 3) * 0.04}
          filter="url(#min-rough)"
        />
      ))}

      {/* Lightning flash — occasional */}
      <motion.line
        x1="310"
        y1="80"
        x2="290"
        y2="155"
        stroke="white"
        strokeWidth="1.5"
        opacity="0"
        animate={{ opacity: [0, 0, 0, 0.8, 0, 0, 0.4, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
      />

      {/* Churning sea — organic waves */}
      {(isMobile ? [340, 380, 415] : [340, 362, 380, 398, 415, 432]).map((y, i) =>
        isMobile ? (
          <path
            key={i}
            d={`M0,${y} Q40,${y - 12 + i * 2} 80,${y} Q120,${y + 12 - i} 160,${y} Q200,${y - 10 + i} 240,${y} Q280,${y + 10 - i} 320,${y} Q360,${y - 11 + i} 400,${y} Q440,${y + 9 - i} 500,${y}`}
            fill="none"
            stroke="#0a1520"
            strokeWidth={8 - i}
            opacity={0.7 + i * 0.05}
          />
        ) : (
          <motion.path
            key={i}
            d={`M0,${y} Q40,${y - 12 + i * 2} 80,${y} Q120,${y + 12 - i} 160,${y} Q200,${y - 10 + i} 240,${y} Q280,${y + 10 - i} 320,${y} Q360,${y - 11 + i} 400,${y} Q440,${y + 9 - i} 500,${y}`}
            fill="none"
            stroke="#0a1520"
            strokeWidth={8 - i}
            opacity={0.7 + i * 0.05}
            animate={{
              d: [
                `M0,${y} Q40,${y - 12 + i * 2} 80,${y} Q120,${y + 12 - i} 160,${y} Q200,${y - 10 + i} 240,${y} Q280,${y + 10 - i} 320,${y} Q360,${y - 11 + i} 400,${y} Q440,${y + 9 - i} 500,${y}`,
                `M0,${y} Q40,${y + 12 - i} 80,${y} Q120,${y - 12 + i * 2} 160,${y} Q200,${y + 10 - i} 240,${y} Q280,${y - 10 + i} 320,${y} Q360,${y + 11 - i} 400,${y} Q440,${y - 9 + i} 500,${y}`,
                `M0,${y} Q40,${y - 12 + i * 2} 80,${y} Q120,${y + 12 - i} 160,${y} Q200,${y - 10 + i} 240,${y} Q280,${y + 10 - i} 320,${y} Q360,${y - 11 + i} 400,${y} Q440,${y + 9 - i} 500,${y}`,
              ],
            }}
            transition={{ duration: 1.8 + i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
          />
        ),
      )}

      {/* Deep water fill */}
      <rect x="0" y="330" width="500" height="370" fill="#040810" opacity="0.75" />

      {/* ── ALL FIGURES ── brightness-lifted for visibility */}
      <g style={{ filter: 'brightness(10) sepia(0.3) contrast(1.2)' }}>
        {/* Fishing boat — dark organic shape */}
        <g filter="url(#min-rough)">
          <path
            d="M28,332 Q85,308 162,312 Q212,310 242,322 Q235,338 202,342 Q122,347 28,340Z"
            fill="#020508"
          />
          <line x1="148" y1="312" x2="148" y2="265" stroke="#020508" strokeWidth="4" />
          <path d="M148,265 L116,290 L148,302Z" fill="#020508" opacity="0.65" />
          {/* Waves crashing on hull */}
          <motion.path
            d="M28,337 Q55,330 72,340"
            stroke="#0e2035"
            strokeWidth="2"
            fill="none"
            animate={{
              d: ['M28,337 Q55,330 72,340', 'M28,340 Q55,334 72,337', 'M28,337 Q55,330 72,340'],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* ── DISCIPLES IN BOAT ── distinct bodies, terrified */}
          {/* Disciple 1 — cowering, arms over head */}
          <g>
            <circle cx="68" cy="318" r="8" fill="#020508" />
            <path
              d="M68,326 Q60,338 62,352"
              stroke="#020508"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M68,326 Q76,334 74,346"
              stroke="#020508"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M60,326 Q48,320 44,312"
              stroke="#020508"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M76,326 Q84,318 82,310"
              stroke="#020508"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </g>
          {/* Disciple 2 — pulling rope, leaning back */}
          <g>
            <circle cx="105" cy="316" r="8" fill="#020508" />
            <path
              d="M105,324 Q98,338 100,350"
              stroke="#020508"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M105,324 Q112,336 110,348"
              stroke="#020508"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M97,328 Q82,322 72,318"
              stroke="#020508"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
          {/* Disciple 3 — bailing water, bent forward */}
          <g>
            <circle cx="140" cy="314" r="8" fill="#020508" />
            <path
              d="M140,322 Q132,335 134,348"
              stroke="#020508"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M132,326 Q124,336 128,346"
              stroke="#020508"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="120" cy="348" rx="10" ry="5" fill="#020508" opacity="0.65" />
          </g>
          {/* Disciple 4 — standing, pointing at Jesus on water */}
          <g>
            <circle cx="178" cy="312" r="8" fill="#020508" />
            <path
              d="M178,320 Q172,335 174,350"
              stroke="#020508"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M178,320 Q184,334 182,348"
              stroke="#020508"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            {/* Pointing arm toward Jesus */}
            <path
              d="M182,322 Q205,315 225,312"
              stroke="#020508"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </g>
          {/* Disciple 5 — gripping the mast */}
          <g>
            <circle cx="148" cy="286" r="7" fill="#020508" />
            <path
              d="M148,293 Q144,306 146,320"
              stroke="#020508"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M144,296 Q138,302 140,310"
              stroke="#020508"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* ── PETER ── half-out of boat, reaching toward Jesus, sinking */}
        <motion.g
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <g filter="url(#min-rough)">
            {/* Body leaning over boat edge */}
            <circle cx="242" cy="316" r="11" fill="#020508" />
            {/* Torso over water */}
            <path
              d="M242,327 Q238,342 240,360"
              stroke="#020508"
              strokeWidth="11"
              fill="none"
              strokeLinecap="round"
            />
            {/* Arm desperately outstretched toward Jesus */}
            <path
              d="M242,332 Q268,322 290,316"
              stroke="#020508"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Other arm gripping boat */}
            <path
              d="M232,330 Q224,332 218,338"
              stroke="#020508"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            {/* Feet splashing — one in water */}
            <motion.ellipse
              cx="240"
              cy="362"
              rx="14"
              ry="5"
              fill="#060d18"
              opacity="0.7"
              animate={{ rx: [12, 18, 12] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </g>
        </motion.g>
      </g>
      {/* end brightness wrapper */}

      {/* Jesus on water — glowing organic form — outside wrapper so it stays bright-white */}
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse
          cx="330"
          cy="340"
          rx="30"
          ry="7"
          fill="white"
          opacity="0.07"
          filter="url(#min-glow)"
        />
        <motion.ellipse
          cx="330"
          cy="335"
          rx="38"
          ry="38"
          fill="white"
          opacity="0.08"
          filter="url(#min-glow)"
          animate={{ opacity: [0.05, 0.14, 0.05] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <g filter="url(#min-rough)">
          <circle cx="330" cy="296" r="16" fill="#c8d8e8" opacity="0.88" />
          <path
            d="M318,312 Q312,330 314,370"
            stroke="#c0d0e0"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M342,312 Q348,330 346,368"
            stroke="#c0d0e0"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M318,318 Q296,318 282,320"
            stroke="#c8d8e8"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            opacity="0.88"
          />
          <path
            d="M342,316 Q356,305 362,295"
            stroke="#c8d8e8"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            opacity="0.82"
          />
        </g>
      </motion.g>
    </svg>
  )
}

// ── Crucifixion ────────────────────────────────────────────
function CrucifixionScene({ accent, isMobile = false }: { accent: string; isMobile?: boolean }) {
  return (
    <svg
      viewBox="0 0 500 700"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    >
      <defs>
        <filter id="cru-rough">
          {isMobile ? (
            <feOffset dx="0" dy="0" />
          ) : (
            <>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.05 0.07"
                numOctaves={5}
                result="n"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="n"
                scale={9}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </>
          )}
        </filter>
        <filter id="cru-glow">
          <feGaussianBlur stdDeviation={isMobile ? 7 : 14} />
        </filter>
        <radialGradient id="cbloodmoon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6a0000" />
          <stop offset="45%" stopColor="#3a0000" />
          <stop offset="100%" stopColor="#0e0000" />
        </radialGradient>
        <radialGradient id="cskyrad" cx="50%" cy="15%" r="65%">
          <stop offset="0%" stopColor="#180200" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>

      <rect width="500" height="700" fill="url(#cskyrad)" />

      {/* Blood moon — atmospheric, shrouded */}
      <ellipse
        cx="250"
        cy="105"
        rx="80"
        ry="75"
        fill="#5a0000"
        opacity="0.25"
        filter="url(#cru-glow)"
      />
      <motion.circle
        cx="250"
        cy="105"
        r="52"
        fill="url(#cbloodmoon)"
        animate={{ opacity: [0.65, 0.9, 0.65] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />
      {/* Eclipse ring */}
      <circle
        cx="250"
        cy="105"
        r="52"
        fill="none"
        stroke="#8a1500"
        strokeWidth="2.5"
        opacity="0.45"
      />

      {/* Heavy dark clouds across moon */}
      {[
        [80, 90, 180, 55],
        [200, 65, 160, 50],
        [360, 88, 140, 48],
        [20, 125, 120, 42],
        [330, 125, 130, 45],
        [450, 105, 110, 40],
        [50, 155, 100, 35],
      ].map(([cx, cy, rx, ry], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="#0a0000"
          opacity={0.88 + (i % 3) * 0.03}
          filter="url(#cru-rough)"
        />
      ))}

      {/* Golgotha hill — jagged, doom-like */}
      <path
        d="M0,530 Q55,475 130,492 Q185,508 248,470 Q312,448 378,468 Q435,485 500,455 L500,700 L0,700Z"
        fill="#060000"
        filter="url(#cru-rough)"
      />
      <path
        d="M0,568 Q80,548 162,560 Q240,572 318,552 Q395,534 500,555 L500,700 L0,700Z"
        fill="#040000"
        filter="url(#cru-rough)"
      />

      {/* Three crosses — rough wood texture feel */}
      {[
        [-115, 10, 0.92],
        [0, 0, 1],
        [115, 12, 0.9],
      ].map(([dx, dy, s], i) => (
        <g
          key={i}
          transform={`translate(${250 + dx},${310 + dy}) scale(${s})`}
          filter="url(#cru-rough)"
        >
          {/* Vertical beam */}
          <rect
            x="-7"
            y="-115"
            width="14"
            height="185"
            fill={i === 1 ? '#3a0800' : '#1c0800'}
            opacity={i === 1 ? 0.95 : 0.75}
          />
          {/* Horizontal beam */}
          <rect
            x="-48"
            y="-72"
            width="96"
            height="12"
            fill={i === 1 ? '#3a0800' : '#1c0800'}
            opacity={i === 1 ? 0.95 : 0.75}
          />
          {/* INRI sign on center cross */}
          {i === 1 && <rect x="-18" y="-120" width="36" height="12" fill="#2a0500" opacity="0.8" />}
          {/* Figure on center cross */}
          {i === 1 && (
            <g>
              <motion.circle
                cx="0"
                cy="-122"
                r="12"
                fill="#1e0400"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              />
              <path
                d="M-7,-110 Q-7,-60 -7,-30"
                stroke="#1a0300"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M-7,-88 Q-42,-76 -50,-72"
                stroke="#1a0300"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M7,-88 Q42,-76 50,-72"
                stroke="#1a0300"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M-7,-30 Q-10,-15 -8,0"
                stroke="#1a0300"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M7,-30 Q10,-15 8,0"
                stroke="#1a0300"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}
        </g>
      ))}

      {/* Earth cracks — rough glowing lines */}
      {[
        'M195,580 L222,568 L248,582 L275,568 L302,580',
        'M95,592 L128,580 L155,595',
        'M340,586 L368,572 L400,584 L425,572',
        'M170,610 L195,600 L215,612',
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={accent}
          strokeWidth="1.8"
          fill="none"
          opacity="0"
          animate={{ opacity: [0, 0.45, 0.2, 0.5, 0.15] }}
          transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          filter="url(#cru-rough)"
        />
      ))}

      {/* ── SAINTS ── brightness-lifted so warm tones pop against black */}
      <g style={{ filter: 'brightness(14) sepia(0.35) contrast(1.1)' }}>
        {/* ── SAINT MARY (Mother of Jesus) ── kneeling at foot of center cross */}
        <g filter="url(#cru-rough)">
          {/* Head with large maphorion veil — distinctive teardrop shape */}
          <path
            d="M228,492 Q248,472 268,492 Q278,515 272,548 Q248,560 224,548 Q218,515 228,492Z"
            fill="#0e0000"
            opacity="0.95"
          />
          {/* Face hint */}
          <ellipse cx="248" cy="505" rx="10" ry="12" fill="#160000" opacity="0.9" />
          {/* Body — kneeling forward in grief */}
          <path
            d="M232,520 Q220,540 218,575 Q238,585 262,582 Q272,555 268,522Z"
            fill="#0d0000"
            filter="url(#cru-rough)"
          />
          {/* Arms raised upward toward cross in anguish */}
          <path
            d="M232,528 Q215,515 208,502"
            stroke="#0e0000"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M266,526 Q280,513 286,500"
            stroke="#0e0000"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Knees on ground — robe pooling */}
          <ellipse cx="235" cy="582" rx="14" ry="5" fill="#0c0000" opacity="0.75" />
          <ellipse cx="258" cy="584" rx="12" ry="5" fill="#0c0000" opacity="0.75" />
        </g>

        {/* ── SAINT JOHN THE APOSTLE ── standing left of Mary, arm around her */}
        <g filter="url(#cru-rough)">
          {/* Head */}
          <circle cx="195" cy="490" r="14" fill="#0e0000" />
          {/* Young, no beard — smooth head */}
          {/* Tall robe — upright, supporting */}
          <path
            d="M183,504 Q176,530 178,585 Q195,592 212,588 Q216,558 214,506Z"
            fill="#0d0000"
            filter="url(#cru-rough)"
          />
          {/* Arm around Mary's shoulders */}
          <path
            d="M212,510 Q228,510 238,516"
            stroke="#0e0000"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Other arm at side, hand in grief gesture */}
          <path
            d="M183,508 Q174,524 172,545"
            stroke="#0e0000"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          {/* Feet */}
          <ellipse cx="193" cy="585" rx="12" ry="4" fill="#0c0000" opacity="0.7" />
        </g>

        {/* ── MARY MAGDALENE ── prostrate at base of cross, hair flowing */}
        <g filter="url(#cru-rough)">
          {/* Body — lying forward, prostrate */}
          <ellipse
            cx="272"
            cy="540"
            rx="30"
            ry="10"
            fill="#0d0000"
            opacity="0.9"
            transform="rotate(-15 272 540)"
          />
          {/* Head bowed to ground */}
          <circle cx="252" cy="530" r="11" fill="#0d0000" />
          {/* Long flowing hair spread on ground */}
          <path
            d="M242,538 Q225,548 215,558 Q220,562 235,555 Q245,548 252,542Z"
            fill="#0b0000"
            opacity="0.85"
          />
          <path
            d="M242,538 Q230,552 228,565"
            stroke="#0b0000"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Arms outstretched forward on ground */}
          <path
            d="M252,534 Q240,540 228,542"
            stroke="#0d0000"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M252,534 Q264,540 274,538"
            stroke="#0d0000"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* ── SOLDIER ── far right, watching with spear */}
        <g filter="url(#cru-rough)" opacity="0.65">
          <circle cx="420" cy="495" r="13" fill="#0a0000" />
          {/* Helmet — rounded top */}
          <path d="M408,490 Q420,478 432,490 Q434,484 420,482 Q406,484 408,490Z" fill="#090000" />
          {/* Armored body */}
          <path d="M408,508 Q402,530 404,565 Q420,572 436,565 Q438,532 432,508Z" fill="#090000" />
          {/* Spear held upright */}
          <line
            x1="440"
            y1="470"
            x2="438"
            y2="590"
            stroke="#080000"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Spear tip */}
          <polygon points="440,470 435,482 445,482" fill="#080000" opacity="0.8" />
          {/* Shield */}
          <ellipse cx="402" cy="535" rx="10" ry="18" fill="#080000" opacity="0.75" />
        </g>
      </g>
      {/* end brightness wrapper */}
    </svg>
  )
}

// ── Resurrection ───────────────────────────────────────────
function ResurrectionScene({ accent, isMobile = false }: { accent: string; isMobile?: boolean }) {
  return (
    <svg
      viewBox="0 0 500 700"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    >
      <defs>
        <filter id="res-rough">
          {isMobile ? (
            <feOffset dx="0" dy="0" />
          ) : (
            <>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.035 0.05"
                numOctaves={4}
                result="n"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="n"
                scale={7}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </>
          )}
        </filter>
        <filter id="res-glow">
          <feGaussianBlur stdDeviation={isMobile ? 8 : 18} />
        </filter>
        <filter id="res-glow2">
          <feGaussianBlur stdDeviation={isMobile ? 4 : 8} />
        </filter>
        <radialGradient id="resburst" cx="50%" cy="58%" r="55%">
          <stop offset="0%" stopColor="#fffbe0" stopOpacity="1" />
          <stop offset="20%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="55%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rescore" cx="50%" cy="58%" r="25%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="500" height="700" fill="#050400" />

      {/* Pre-dawn horizon glow — barely visible */}
      <ellipse cx="250" cy="700" rx="400" ry="280" fill={accent} opacity="0.06" />

      {/* Outer explosion — massive glow */}
      <motion.ellipse
        cx="250"
        cy="408"
        rx="350"
        ry="380"
        fill="url(#resburst)"
        filter="url(#res-glow)"
        animate={{ opacity: [0.3, 0.75, 0.3], rx: [300, 370, 300] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      />

      {/* Inner core */}
      <motion.ellipse
        cx="250"
        cy="408"
        rx="120"
        ry="135"
        fill="url(#rescore)"
        filter="url(#res-glow)"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />

      {/* Light rays — 24 on desktop, 10 on mobile */}
      {Array.from({ length: isMobile ? 10 : 24 }, (_, i) => {
        const total = isMobile ? 10 : 24
        const angle = (i / total) * Math.PI * 2
        const len = 200 + (i % 5) * 55
        const x1 = 250 + Math.cos(angle) * 22
        const y1 = 408 + Math.sin(angle) * 22
        const x2 = 250 + Math.cos(angle) * len
        const y2 = 408 + Math.sin(angle) * len
        return isMobile ? (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={accent}
            strokeWidth={i % 4 === 0 ? 2.5 : 1.2}
            opacity={0.22}
          />
        ) : (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={accent}
            strokeWidth={i % 4 === 0 ? 2.5 : i % 2 === 0 ? 1.5 : 0.8}
            opacity={0.18 + ((24 - i) / 24) * 0.18}
            animate={{ opacity: [0.08, 0.38, 0.08] }}
            transition={{ duration: 1.4 + i * 0.07, repeat: Infinity, delay: i * 0.04 }}
          />
        )
      })}

      {/* Rocky tomb entrance — massive, jagged */}
      <path
        d="M60,700 L60,410 Q60,295 250,295 Q440,295 440,410 L440,700Z"
        fill="#060500"
        filter="url(#res-rough)"
      />
      <path
        d="M90,700 L90,418 Q90,318 250,318 Q410,318 410,418 L410,700Z"
        fill="#0a0800"
        filter="url(#res-rough)"
      />
      <path d="M115,700 L115,428 Q115,340 250,340 Q385,340 385,428 L385,700Z" fill="#0f0c00" />

      {/* Interior tomb light spill */}
      <motion.ellipse
        cx="250"
        cy="520"
        rx="110"
        ry="140"
        fill={accent}
        opacity="0.14"
        animate={{ opacity: [0.08, 0.22, 0.08] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />

      {/* Empty burial cloth — crumpled suggestion */}
      <g filter="url(#res-rough)">
        <path
          d="M210,590 Q250,578 290,588 Q285,605 250,610 Q215,605 210,590Z"
          fill="#181400"
          opacity="0.8"
        />
        <path
          d="M220,595 Q250,585 280,593"
          stroke="#1e1a00"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </g>

      {/* Stone rolled away — heavy, textured */}
      <ellipse cx="95" cy="430" rx="48" ry="52" fill="#1a1600" filter="url(#res-rough)" />
      <ellipse cx="95" cy="430" rx="38" ry="42" fill="#120f00" filter="url(#res-rough)" />
      <ellipse cx="88" cy="424" rx="16" ry="18" fill="#0a0800" opacity="0.6" />

      {/* Risen figure — glowing, arms raised, organic */}
      <motion.g
        animate={{ y: [0, -14, 0], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 3.2, repeat: Infinity }}
      >
        <ellipse
          cx="250"
          cy="368"
          rx="45"
          ry="65"
          fill={accent}
          opacity="0.15"
          filter="url(#res-glow2)"
        />
        <g filter="url(#res-rough)">
          <circle cx="250" cy="325" r="20" fill="#fffde8" opacity="0.92" />
          <rect x="237" y="344" width="26" height="65" rx="13" fill="#fff8d0" opacity="0.9" />
          {/* Arms wide raised in triumph */}
          <path
            d="M237,360 Q212,340 196,328"
            stroke="#fffde8"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            opacity="0.88"
          />
          <path
            d="M263,360 Q288,340 304,328"
            stroke="#fffde8"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            opacity="0.88"
          />
          {/* Garment drape */}
          <path
            d="M237,408 Q225,430 228,458"
            stroke="#fff0c0"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M263,408 Q275,430 272,458"
            stroke="#fff0c0"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      </motion.g>

      {/* ── ANGEL LEFT ── sitting on rolled stone, white robes, wings */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <g filter="url(#res-rough)">
          {/* Wing — sweeping back shape */}
          <path
            d="M62,388 Q38,360 30,318 Q50,330 68,362 Q78,378 72,398Z"
            fill="#fffde0"
            opacity="0.55"
          />
          <path d="M62,388 Q42,372 36,340 Q54,350 66,374Z" fill="#fffde0" opacity="0.38" />
          {/* Body — seated on stone */}
          <path
            d="M68,398 Q60,418 62,448 Q78,458 96,452 Q100,425 96,400Z"
            fill="#fffde0"
            opacity="0.75"
          />
          {/* Head */}
          <circle cx="82" cy="388" r="16" fill="#fffde0" opacity="0.82" />
          {/* Radiant halo */}
          <motion.circle
            cx="82"
            cy="388"
            r="22"
            fill="none"
            stroke="#e8c840"
            strokeWidth="1.5"
            opacity="0.45"
            animate={{ r: [20, 26, 20], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          {/* Arm gesturing toward empty tomb interior */}
          <path
            d="M96,404 Q114,398 128,390"
            stroke="#fffde0"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Other arm pointing upward */}
          <path
            d="M68,404 Q58,390 54,374"
            stroke="#fffde0"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
      </motion.g>

      {/* ── ANGEL RIGHT ── standing at other side of tomb, wings spread */}
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <g filter="url(#res-rough)">
          {/* Large wing spreading right */}
          <path
            d="M418,380 Q445,350 465,305 Q448,322 434,355 Q426,372 422,395Z"
            fill="#fffde0"
            opacity="0.5"
          />
          <path d="M418,380 Q440,362 452,332 Q438,345 428,368Z" fill="#fffde0" opacity="0.35" />
          {/* Body */}
          <path
            d="M398,398 Q395,420 398,450 Q415,460 432,454 Q436,428 430,400Z"
            fill="#fffde0"
            opacity="0.72"
          />
          {/* Head */}
          <circle cx="414" cy="386" r="16" fill="#fffde0" opacity="0.82" />
          {/* Halo */}
          <motion.circle
            cx="414"
            cy="386"
            r="22"
            fill="none"
            stroke="#e8c840"
            strokeWidth="1.5"
            opacity="0.45"
            animate={{ r: [20, 26, 20], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
          />
          {/* Arm gesturing inward — "He is not here" */}
          <path
            d="M398,404 Q380,400 365,392"
            stroke="#fffde0"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Other arm raised */}
          <path
            d="M430,402 Q442,390 448,376"
            stroke="#fffde0"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
      </motion.g>

      {/* ── MARY MAGDALENE + GUARDS ── brightness-lifted for visibility */}
      <g style={{ filter: 'brightness(10) sepia(0.5) contrast(1.1)' }}>
        {/* ── MARY MAGDALENE ── approaching tomb, hand raised in amazement */}
        <g filter="url(#res-rough)">
          {/* Head — with head covering */}
          <circle cx="172" cy="488" r="14" fill="#181200" opacity="0.88" />
          {/* Head scarf / veil over hair */}
          <path
            d="M160,482 Q172,470 184,482 Q188,496 184,512 Q172,518 160,512 Q156,496 160,482Z"
            fill="#141000"
            opacity="0.85"
          />
          {/* Body — walking forward, leaning in awe */}
          <path
            d="M162,502 Q155,525 158,568 Q172,578 188,574 Q192,540 188,504Z"
            fill="#151100"
            filter="url(#res-rough)"
          />
          {/* Long hair/veil flowing behind */}
          <path
            d="M160,488 Q142,500 138,520"
            stroke="#111000"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Arm raised shielding eyes from the blinding light */}
          <path
            d="M162,510 Q148,500 140,490"
            stroke="#151100"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Other arm reaching toward tomb */}
          <path
            d="M188,510 Q202,505 215,498"
            stroke="#151100"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Feet — stepping forward */}
          <ellipse cx="165" cy="570" rx="12" ry="4" fill="#121000" opacity="0.7" />
          <ellipse cx="183" cy="574" rx="10" ry="4" fill="#121000" opacity="0.7" />
          {/* Ointment jar she carries */}
          <ellipse cx="218" cy="502" rx="7" ry="9" fill="#151100" opacity="0.75" />
          <ellipse cx="218" cy="494" rx="4" ry="3" fill="#131000" opacity="0.7" />
        </g>

        {/* Guards fallen on ground — knocked back by the resurrection light */}
        {[
          [130, 510],
          [368, 505],
        ].map(([x, y], i) => (
          <g key={i} filter="url(#res-rough)" opacity="0.55">
            {/* Body flat on ground */}
            <ellipse
              cx={x}
              cy={y}
              rx="32"
              ry="12"
              fill="#080600"
              transform={`rotate(${i === 0 ? -12 : 12} ${x} ${y})`}
            />
            {/* Head */}
            <circle cx={x + (i === 0 ? -22 : 22)} cy={y - 6} r="10" fill="#080600" />
            {/* Helmet fallen off */}
            <ellipse
              cx={x + (i === 0 ? -38 : 38)}
              cy={y + 2}
              rx="10"
              ry="7"
              fill="#060500"
              opacity="0.7"
            />
            {/* Arm thrown back */}
            <path
              d={`M${x + (i === 0 ? 8 : -8)},${y - 2} Q${x + (i === 0 ? 22 : -22)},${y - 14} ${x + (i === 0 ? 32 : -32)},${y - 10}`}
              stroke="#080600"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
      {/* end brightness wrapper */}
    </svg>
  )
}

// ── Film overlay components ────────────────────────────────

const grainA = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='220' height='220' filter='url(%23g)' opacity='0.55'/></svg>`
const grainB = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='180' height='180' filter='url(%23g)' opacity='0.45'/></svg>`
const GRAIN_A = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(grainA)}`
const GRAIN_B = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(grainB)}`

const SCENE_COMPONENTS = [
  BirthScene,
  BaptismScene,
  MinistryScene,
  CrucifixionScene,
  ResurrectionScene,
]

function FilmScratches() {
  const [scratches, setScratches] = useState<{ x: number; h: number; op: number; top: number }[]>(
    [],
  )
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.3) {
        const n = Math.floor(Math.random() * 2) + 1
        setScratches(
          Array.from({ length: n }, () => ({
            x: Math.random() * 100,
            top: Math.random() * 80,
            h: 20 + Math.random() * 60,
            op: 0.12 + Math.random() * 0.28,
          })),
        )
        setTimeout(() => setScratches([]), 55 + Math.random() * 70)
      }
    }, 110)
    return () => clearInterval(id)
  }, [])
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 6,
      }}
    >
      {scratches.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.top}%`,
            width: '1px',
            height: `${s.h}%`,
            background: 'white',
            opacity: s.op,
          }}
        />
      ))}
    </div>
  )
}

function Particles({ accent }: { accent: string }) {
  const pts = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        delay: Math.random() * 5,
        dur: 4 + Math.random() * 5,
        size: 1 + Math.random() * 2.5,
        drift: (Math.random() - 0.5) * 60,
      })),
    [],
  )
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      {pts.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: '-4%',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: accent,
            boxShadow: `0 0 ${p.size * 3}px ${accent}`,
            willChange: 'transform,opacity',
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 800) * 0.95],
            x: [0, p.drift],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

function ScanLine({ accent }: { accent: string }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent 0%, ${accent}50 30%, ${accent}80 50%, ${accent}50 70%, transparent 100%)`,
        pointerEvents: 'none',
        zIndex: 7,
        willChange: 'top',
      }}
      animate={{ top: ['0%', '102%'] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
    />
  )
}

export default function JesusLoadingOverlay({ isVisible = false }: { isVisible?: boolean }) {
  const [mounted, setMounted] = useState(false)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [grainPos, setGrainPos] = useState({ ax: 0, ay: 0, bx: 0, by: 0 })
  const [flicker, setFlicker] = useState(1)
  const [flash, setFlash] = useState(false)
  const flickerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(Date.now())
  const isMobile = useIsMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Scene timer + smooth progress bar — rAF-based
  useEffect(() => {
    if (!isVisible) {
      setSceneIndex(0)
      setProgress(0)
      return
    }
    startRef.current = Date.now()
    let raf: number
    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const p = Math.min(elapsed / SCENE_DURATION, 1)
      setProgress(p)
      if (p >= 1) {
        setFlash(true)
        setTimeout(() => setFlash(false), 140)
        setSceneIndex((i) => (i + 1) % scenes.length)
        startRef.current = Date.now()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isVisible])

  // Grain — disabled on mobile to prevent re-renders
  useEffect(() => {
    if (!isVisible || isMobile) return
    const id = setInterval(() => {
      setGrainPos({
        ax: (Math.random() - 0.5) * 40,
        ay: (Math.random() - 0.5) * 40,
        bx: (Math.random() - 0.5) * 30,
        by: (Math.random() - 0.5) * 30,
      })
    }, 55)
    return () => clearInterval(id)
  }, [isVisible, isMobile])

  // Projector flicker — disabled on mobile
  useEffect(() => {
    if (!isVisible || isMobile) return
    const flick = () => {
      const r = Math.random()
      if (r < 0.06) setFlicker(0.7)
      else if (r < 0.14) setFlicker(0.86)
      else setFlicker(1)
    }
    flickerRef.current = setInterval(flick, 95)
    return () => {
      if (flickerRef.current) clearInterval(flickerRef.current)
    }
  }, [isVisible, isMobile])

  if (!mounted || !isVisible) return null

  const scene = scenes[sceneIndex]
  const SceneComponent = SCENE_COMPONENTS[sceneIndex]

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="jesus-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...(isMobile ? {} : { filter: `brightness(${flicker})`, willChange: 'filter' }),
          background: '#000',
        }}
      >
        {/* ── Cinematic letterbox bars ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '7vh',
            background: '#000',
            zIndex: 30,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '7vh',
            background: '#000',
            zIndex: 30,
            pointerEvents: 'none',
          }}
        />

        {/* ── Scene transition flash ── */}
        {flash && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'white',
              opacity: 0.18,
              zIndex: 28,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* ── Scene SVG — Ken Burns slow zoom ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`svg-${scene.id}`}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'absolute', inset: '-10%', willChange: 'transform,opacity' }}
          >
            <SceneComponent accent={scene.accent} isMobile={isMobile} />
          </motion.div>
        </AnimatePresence>

        {/* ── Scene mood tint ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`tint-${scene.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: scene.tint,
              pointerEvents: 'none',
              mixBlendMode: 'multiply',
            }}
          />
        </AnimatePresence>

        {/* ── Floating light particles (desktop only) ── */}
        {!isMobile && <Particles key={scene.id} accent={scene.accent} />}

        {/* ── Grain layer A — static on mobile, animated on desktop ── */}
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              inset: '-20%',
              width: '140%',
              height: '140%',
              backgroundImage: `url("${GRAIN_A}")`,
              backgroundRepeat: 'repeat',
              opacity: 0.26,
              pointerEvents: 'none',
              transform: `translate(${grainPos.ax}px,${grainPos.ay}px)`,
              mixBlendMode: 'overlay',
              willChange: 'transform',
            }}
          />
        )}

        {/* ── Grain layer B — fine (desktop only) ── */}
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              inset: '-20%',
              width: '140%',
              height: '140%',
              backgroundImage: `url("${GRAIN_B}")`,
              backgroundRepeat: 'repeat',
              opacity: 0.16,
              pointerEvents: 'none',
              transform: `translate(${grainPos.bx}px,${grainPos.by}px)`,
              mixBlendMode: 'screen',
              willChange: 'transform',
            }}
          />
        )}

        {/* ── Halftone grid (desktop only) ── */}
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* ── Film scratches (desktop only) ── */}
        {!isMobile && <FilmScratches />}

        {/* ── Scan line sweep (desktop only) ── */}
        {!isMobile && <ScanLine accent={scene.accent} />}

        {/* ── Deep cinematic vignette ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 8,
            background:
              'radial-gradient(ellipse at 50% 50%, transparent 22%, rgba(0,0,0,0.52) 58%, rgba(0,0,0,0.93) 100%)',
          }}
        />

        {/* ── UI content ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 15,
            textAlign: 'center',
            padding: '0 clamp(16px,5vw,32px)',
            width: '100%',
            maxWidth: '520px',
            marginTop: '2vh',
          }}
        >
          {/* Scene counter — top-right (desktop only) */}
          {!isMobile && (
            <div
              style={{
                position: 'absolute',
                top: '-5.5vh',
                right: 'clamp(16px,5vw,32px)',
                fontFamily: 'monospace',
                fontSize: '0.62rem',
                letterSpacing: '0.35em',
                color: 'rgba(255,255,255,0.3)',
                pointerEvents: 'none',
              }}
            >
              {String(sceneIndex + 1).padStart(2, '0')} <span style={{ opacity: 0.5 }}>/</span>{' '}
              {String(scenes.length).padStart(2, '0')}
            </div>
          )}

          {/* Ethiopian cross — spring entrance, glow pulse */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cross-${scene.id}`}
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
              transition={{ duration: 0.55, type: 'spring', stiffness: 220, damping: 18 }}
              style={{ marginBottom: 'clamp(10px,2vh,18px)' }}
            >
              <motion.svg
                width="48"
                height="48"
                viewBox="0 0 40 40"
                style={{ display: 'inline-block' }}
                animate={{
                  filter: [
                    `drop-shadow(0 0 5px ${scene.accent}) drop-shadow(0 0 12px ${scene.accent}60)`,
                    `drop-shadow(0 0 12px ${scene.accent}) drop-shadow(0 0 28px ${scene.accent}90)`,
                    `drop-shadow(0 0 5px ${scene.accent}) drop-shadow(0 0 12px ${scene.accent}60)`,
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <rect x="17" y="2" width="6" height="36" rx="1.5" fill={scene.accent} />
                <rect x="2" y="12" width="36" height="6" rx="1.5" fill={scene.accent} />
                <circle
                  cx="20"
                  cy="15"
                  r="5.5"
                  fill="none"
                  stroke={scene.accent}
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <circle cx="20" cy="15" r="2.2" fill={scene.accent} opacity="0.5" />
              </motion.svg>
            </motion.div>
          </AnimatePresence>

          {/* Amharic title — blur-in, large */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`am-${scene.id}`}
              initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -24, filter: 'blur(6px)' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                style={{
                  fontFamily: "'Noto Sans Ethiopic', serif",
                  fontSize: 'clamp(2.6rem,10vw,4.4rem)',
                  fontWeight: 700,
                  lineHeight: 1.05,
                  color: scene.accent,
                  textShadow: `0 0 28px ${scene.accent}, 0 0 60px ${scene.accent}70, 0 0 110px ${scene.accent}38, 2px 2px 14px rgba(0,0,0,0.99)`,
                  letterSpacing: '0.05em',
                  marginBottom: 'clamp(4px,1vh,8px)',
                }}
              >
                {scene.amharic}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* English — letter-spacing slide in */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`en-${scene.id}`}
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.28em' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
            >
              <div
                style={{
                  fontSize: 'clamp(0.62rem,2.2vw,0.85rem)',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.48)',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  marginBottom: 'clamp(12px,2.2vh,18px)',
                }}
              >
                {scene.english}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Animated glowing divider */}
          <motion.div
            style={{
              height: 1,
              margin: '0 auto clamp(10px,1.8vh,16px)',
              background: `linear-gradient(90deg, transparent, ${scene.accent}, transparent)`,
              boxShadow: `0 0 10px ${scene.accent}`,
            }}
            animate={{ width: ['30px', '56px', '30px'], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Verse — fade up with delay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`verse-${scene.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 0.85, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                style={{
                  fontSize: 'clamp(0.66rem,2vw,0.82rem)',
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.65)',
                  maxWidth: 320,
                  margin: '0 auto',
                  lineHeight: 1.65,
                  textShadow: '0 1px 10px rgba(0,0,0,0.98)',
                }}
              >
                "{scene.verseText}"
              </div>
              <div
                style={{
                  fontSize: 'clamp(0.56rem,1.5vw,0.68rem)',
                  color: scene.accent,
                  opacity: 0.72,
                  marginTop: 6,
                  letterSpacing: '0.18em',
                }}
              >
                — {scene.verse}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Scene dots */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 10,
              marginTop: 'clamp(18px,3vh,28px)',
            }}
          >
            {scenes.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === sceneIndex ? 30 : 6,
                  background: i === sceneIndex ? scene.accent : 'rgba(255,255,255,0.18)',
                  boxShadow:
                    i === sceneIndex
                      ? `0 0 12px ${scene.accent}, 0 0 22px ${scene.accent}60`
                      : 'none',
                }}
                transition={{ duration: 0.38, ease: 'easeOut' }}
                style={{ height: 5, borderRadius: 3 }}
              />
            ))}
          </div>

          {/* Scene progress bar — fills over SCENE_DURATION (desktop only) */}
          {!isMobile && (
            <div
              style={{
                width: 'min(200px,50vw)',
                margin: '10px auto 0',
                height: 2,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  borderRadius: 2,
                  originX: 0,
                  background: `linear-gradient(90deg, ${scene.accent}80, ${scene.accent})`,
                  boxShadow: `0 0 8px ${scene.accent}`,
                  scaleX: progress,
                  willChange: 'transform',
                }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
