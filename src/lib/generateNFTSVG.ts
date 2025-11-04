
export interface NFTData {
  user1Username: string;
  user2Username: string;
  user1PfpUrl?: string;
  user2PfpUrl?: string;
  similarity: number;
  textJaccard: number;
  hashtagOverlap: number;
  emojiOverlap: number;
}

/**
 * NFT 디자인 SVG 문자열을 생성하는 함수
 * Step3Result와 useMintNFT에서 모두 사용
 */
export function generateNFTSVG(data: NFTData): string {
  const {
    user1Username,
    user2Username,
    user1PfpUrl,
    user2PfpUrl,
    similarity,
    textJaccard,
    hashtagOverlap,
    emojiOverlap,
  } = data;

  // Process pfp URLs - replace /avatar with /public if needed
  const user1Pfp = user1PfpUrl && user1PfpUrl.trim() !== '' 
    ? (user1PfpUrl.includes('/avatar') ? user1PfpUrl.replace('/avatar', '/public') : user1PfpUrl)
    : '';
  const user2Pfp = user2PfpUrl && user2PfpUrl.trim() !== '' 
    ? (user2PfpUrl.includes('/avatar') ? user2PfpUrl.replace('/avatar', '/public') : user2PfpUrl)
    : '';

  return `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Deep night sky gradient -->
        <linearGradient id="nightBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0e27;stop-opacity:1" />
          <stop offset="30%" style="stop-color:#1a1f3a;stop-opacity:1" />
          <stop offset="70%" style="stop-color:#1f285d;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2d1b4e;stop-opacity:1" />
        </linearGradient>
        
        <!-- Milky Way gradient -->
        <radialGradient id="milkyWay" cx="50%" cy="30%" r="60%">
          <stop offset="0%" style="stop-color:#2a3a5f;stop-opacity:0.4" />
          <stop offset="50%" style="stop-color:#1f285d;stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:#0a0e27;stop-opacity:0" />
        </radialGradient>
        
        <!-- Moon gradient -->
        <radialGradient id="moonGradient" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:#f5f5dc;stop-opacity:0.7" />
          <stop offset="70%" style="stop-color:#fffac2;stop-opacity:0.5" />
          <stop offset="100%" style="stop-color:#fffac2;stop-opacity:0.3" />
        </radialGradient>
        
        <!-- Shooting star gradients -->
        <linearGradient id="shootingStar1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#fffac2;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#fffac2;stop-opacity:0" />
        </linearGradient>
        <linearGradient id="shootingStar2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#fffac2;stop-opacity:0.7" />
          <stop offset="100%" style="stop-color:#fffac2;stop-opacity:0" />
        </linearGradient>
        <linearGradient id="shootingStar3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#fffac2;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#fffac2;stop-opacity:0" />
        </linearGradient>
        
        <!-- Star glow filter -->
        <filter id="starGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <!-- Bright star glow filter -->
        <filter id="brightStarGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <!-- Moon glow filter -->
        <filter id="moonGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <!-- Profile gradients -->
        <linearGradient id="profile1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="profile2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f5576c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ff6b9d;stop-opacity:1" />
        </linearGradient>
        <clipPath id="clip-circle1">
          <circle cx="130" cy="180" r="65"/>
        </clipPath>
        <clipPath id="clip-circle2">
          <circle cx="270" cy="180" r="65"/>
        </clipPath>
      </defs>
      
      <!-- Night Sky Background -->
      <rect width="400" height="400" fill="url(#nightBg)"/>
      
      <!-- Milky Way -->
      <ellipse cx="200" cy="120" rx="180" ry="60" fill="url(#milkyWay)" opacity="0.6"/>
      
      <!-- Moon (Crescent) -->
      <g transform="translate(320, 60)" opacity="0.6" filter="url(#moonGlow)">
        <circle cx="0" cy="0" r="25" fill="url(#moonGradient)"/>
        <circle cx="8" cy="0" r="20" fill="url(#nightBg)"/>
      </g>
      
      <!-- Many animated stars -->
      <g filter="url(#starGlow)" opacity="0.8">
        <!-- Bright stars with twinkle animation -->
        <circle cx="80" cy="80" r="1.5" fill="#ffffff">
          <animate attributeName="opacity" values="0.9;0.3;0.9;1;0.9" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="210" cy="70" r="1.8" fill="#fffac2" filter="url(#brightStarGlow)">
          <animate attributeName="opacity" values="0.9;0.3;0.9;1;0.9" dur="3s" begin="0.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="340" cy="100" r="1.5" fill="#ffffff">
          <animate attributeName="opacity" values="0.9;0.3;0.9;1;0.9" dur="3s" begin="1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="50" cy="320" r="1.5" fill="#ffffff">
          <animate attributeName="opacity" values="0.9;0.3;0.9;1;0.9" dur="3s" begin="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="350" cy="300" r="1.5" fill="#fffac2">
          <animate attributeName="opacity" values="0.9;0.3;0.9;1;0.9" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        <!-- Medium stars -->
        <circle cx="120" cy="50" r="1" fill="#ffffff" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.2;0.7;1;0.7" dur="4s" begin="0.3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="280" cy="80" r="1" fill="#fffac2" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6;1;0.6" dur="3.5s" begin="1.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="60" cy="280" r="1" fill="#ffffff" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.2;0.7;1;0.7" dur="4.5s" begin="0.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="320" cy="320" r="1" fill="#fffac2" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6;1;0.6" dur="3.8s" begin="2s" repeatCount="indefinite"/>
        </circle>
        
        <!-- Tiny stars -->
        <circle cx="40" cy="60" r="0.5" fill="#ffffff" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5;0.8;0.5" dur="5s" begin="0.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="150" cy="40" r="0.5" fill="#ffffff" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4;0.7;0.4" dur="4.5s" begin="0.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="280" cy="50" r="0.5" fill="#fffac2" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5;0.8;0.5" dur="5.5s" begin="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="360" cy="70" r="0.5" fill="#ffffff" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4;0.7;0.4" dur="4s" begin="0.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="30" cy="120" r="0.5" fill="#ffffff" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5;0.8;0.5" dur="5s" begin="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="370" cy="140" r="0.5" fill="#fffac2" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4;0.7;0.4" dur="4.5s" begin="1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="90" cy="240" r="0.5" fill="#ffffff" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5;0.8;0.5" dur="5.5s" begin="0.3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="230" cy="260" r="0.5" fill="#fffac2" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4;0.7;0.4" dur="4s" begin="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="310" cy="240" r="0.5" fill="#ffffff" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5;0.8;0.5" dur="5s" begin="0.7s" repeatCount="indefinite"/>
        </circle>
        <circle cx="100" cy="340" r="0.5" fill="#fffac2" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4;0.7;0.4" dur="4.5s" begin="2.3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="250" cy="350" r="0.5" fill="#ffffff" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5;0.8;0.5" dur="5s" begin="1.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="380" cy="340" r="0.5" fill="#fffac2" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4;0.7;0.4" dur="4s" begin="0.9s" repeatCount="indefinite"/>
        </circle>
        <circle cx="140" cy="160" r="0.5" fill="#ffffff" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5;0.8;0.5" dur="5.5s" begin="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="260" cy="180" r="0.5" fill="#fffac2" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4;0.7;0.4" dur="4s" begin="2.1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="190" cy="220" r="0.5" fill="#ffffff" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5;0.8;0.5" dur="5s" begin="0.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="70" cy="200" r="0.5" fill="#fffac2" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4;0.7;0.4" dur="4.5s" begin="1.7s" repeatCount="indefinite"/>
        </circle>
        <circle cx="330" cy="200" r="0.5" fill="#ffffff" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5;0.8;0.5" dur="5.5s" begin="0.6s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      <!-- Shooting Stars -->
      <g>
        <!-- Shooting Star 1 -->
        <circle cx="60" cy="50" r="1.5" fill="#ffffff" opacity="1">
          <animate attributeName="opacity" values="1;0" dur="2s" begin="0s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -25,25" dur="2s" begin="0s" repeatCount="indefinite"/>
        </circle>
        <line x1="60" y1="50" x2="35" y2="75" stroke="url(#shootingStar1)" stroke-width="2.5" stroke-linecap="round">
          <animate attributeName="opacity" values="1;0" dur="2s" begin="0s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -25,25" dur="2s" begin="0s" repeatCount="indefinite"/>
        </line>
        <line x1="58" y1="52" x2="33" y2="77" stroke="url(#shootingStar1)" stroke-width="1.5" stroke-opacity="0.6" stroke-linecap="round">
          <animate attributeName="opacity" values="0.6;0" dur="2s" begin="0s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -25,25" dur="2s" begin="0s" repeatCount="indefinite"/>
        </line>
        <line x1="62" y1="48" x2="37" y2="73" stroke="url(#shootingStar1)" stroke-width="1.5" stroke-opacity="0.6" stroke-linecap="round">
          <animate attributeName="opacity" values="0.6;0" dur="2s" begin="0s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -25,25" dur="2s" begin="0s" repeatCount="indefinite"/>
        </line>
        
        <!-- Shooting Star 2 -->
        <circle cx="380" cy="30" r="1.5" fill="#ffffff" opacity="1">
          <animate attributeName="opacity" values="1;0" dur="2.5s" begin="1s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -30,30" dur="2.5s" begin="1s" repeatCount="indefinite"/>
        </circle>
        <line x1="380" y1="30" x2="350" y2="60" stroke="url(#shootingStar2)" stroke-width="2.5" stroke-linecap="round">
          <animate attributeName="opacity" values="1;0" dur="2.5s" begin="1s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -30,30" dur="2.5s" begin="1s" repeatCount="indefinite"/>
        </line>
        <line x1="378" y1="32" x2="348" y2="62" stroke="url(#shootingStar2)" stroke-width="1.5" stroke-opacity="0.6" stroke-linecap="round">
          <animate attributeName="opacity" values="0.6;0" dur="2.5s" begin="1s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -30,30" dur="2.5s" begin="1s" repeatCount="indefinite"/>
        </line>
        <line x1="382" y1="28" x2="352" y2="58" stroke="url(#shootingStar2)" stroke-width="1.5" stroke-opacity="0.6" stroke-linecap="round">
          <animate attributeName="opacity" values="0.6;0" dur="2.5s" begin="1s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -30,30" dur="2.5s" begin="1s" repeatCount="indefinite"/>
        </line>
        
        <!-- Shooting Star 3 -->
        <circle cx="20" cy="250" r="1.5" fill="#ffffff" opacity="1">
          <animate attributeName="opacity" values="1;0" dur="2s" begin="2s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -25,25" dur="2s" begin="2s" repeatCount="indefinite"/>
        </circle>
        <line x1="20" y1="250" x2="-5" y2="275" stroke="url(#shootingStar3)" stroke-width="2.5" stroke-linecap="round">
          <animate attributeName="opacity" values="1;0" dur="2s" begin="2s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -25,25" dur="2s" begin="2s" repeatCount="indefinite"/>
        </line>
        <line x1="18" y1="252" x2="-7" y2="277" stroke="url(#shootingStar3)" stroke-width="1.5" stroke-opacity="0.6" stroke-linecap="round">
          <animate attributeName="opacity" values="0.6;0" dur="2s" begin="2s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -25,25" dur="2s" begin="2s" repeatCount="indefinite"/>
        </line>
        <line x1="22" y1="248" x2="-3" y2="273" stroke="url(#shootingStar3)" stroke-width="1.5" stroke-opacity="0.6" stroke-linecap="round">
          <animate attributeName="opacity" values="0.6;0" dur="2s" begin="2s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; -25,25" dur="2s" begin="2s" repeatCount="indefinite"/>
        </line>
      </g>
      
      <!-- User 2 Profile Picture (Left - Twin) -->
      ${user2Pfp && user2Pfp.trim() !== '' ? `
        <g clip-path="url(#clip-circle1)">
          <image 
            href="${user2Pfp}" 
            x="60" 
            y="110" 
            width="140" 
            height="140"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      ` : `
        <circle cx="130" cy="180" r="65" fill="url(#profile2)"/>
        <!-- 별 모양 그리기 - 더 예쁘게 -->
        <g transform="translate(130, 180)">
          <defs>
            <filter id="defaultStarGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <!-- 그림자 효과 -->
          <path d="M 0,-32 L 9.5,-10.5 L 33,-10.5 L 13.5,1.5 L 21.5,26 L 0,11 L -21.5,26 L -13.5,1.5 L -33,-10.5 L -9.5,-10.5 Z" 
                fill="white" opacity="0.3" transform="translate(1, 1)"/>
          <!-- 메인 별 -->
          <path d="M 0,-32 L 9.5,-10.5 L 33,-10.5 L 13.5,1.5 L 21.5,26 L 0,11 L -21.5,26 L -13.5,1.5 L -33,-10.5 L -9.5,-10.5 Z" 
                fill="white" opacity="0.98" filter="url(#defaultStarGlow)"/>
          <!-- 내부 하이라이트 -->
          <circle cx="0" cy="0" r="8" fill="white" opacity="0.4"/>
        </g>
      `}
      <circle cx="130" cy="180" r="70" fill="none" stroke="white" stroke-width="5"/>
      
      <!-- User 1 Profile Picture (Right - Me) -->
      ${user1Pfp && user1Pfp.trim() !== '' ? `
        <g clip-path="url(#clip-circle2)">
          <image 
            href="${user1Pfp}" 
            x="200" 
            y="110" 
            width="140" 
            height="140"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      ` : `
        <circle cx="270" cy="180" r="65" fill="url(#profile1)"/>
        <!-- 별 모양 그리기 - 더 예쁘게 -->
        <g transform="translate(270, 180)">
          <defs>
            <filter id="defaultStarGlow2">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <!-- 그림자 효과 -->
          <path d="M 0,-32 L 9.5,-10.5 L 33,-10.5 L 13.5,1.5 L 21.5,26 L 0,11 L -21.5,26 L -13.5,1.5 L -33,-10.5 L -9.5,-10.5 Z" 
                fill="white" opacity="0.3" transform="translate(1, 1)"/>
          <!-- 메인 별 -->
          <path d="M 0,-32 L 9.5,-10.5 L 33,-10.5 L 13.5,1.5 L 21.5,26 L 0,11 L -21.5,26 L -13.5,1.5 L -33,-10.5 L -9.5,-10.5 Z" 
                fill="white" opacity="0.98" filter="url(#defaultStarGlow2)"/>
          <!-- 내부 하이라이트 -->
          <circle cx="0" cy="0" r="8" fill="white" opacity="0.4"/>
        </g>
      `}
      <circle cx="270" cy="180" r="70" fill="none" stroke="white" stroke-width="5"/>
      
      <!-- X Symbol in the center -->
      <g transform="translate(200, 180)">
        <circle cx="0" cy="0" r="25" fill="white" opacity="0.9"/>
        <text x="0" y="0" text-anchor="middle" 
              font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
              fill="#667eea" dy=".35em">×</text>
      </g>
      
      <!-- Username Section -->
      <rect x="20" y="290" width="360" height="110" fill="rgba(255, 255, 255, 0.95)" rx="20" ry="20"/>
      
      <text x="130" y="325" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
            fill="#f5576c" dy=".3em">@${user2Username}</text>
      
      <text x="270" y="325" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
            fill="#667eea" dy=".3em">@${user1Username}</text>
      
      <line x1="200" y1="310" x2="200" y2="350" stroke="#e5e7eb" stroke-width="2" stroke-dasharray="5,5"/>
      
      <text x="200" y="365" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="13" font-weight="600" 
            fill="#9ca3af" dy=".3em">${similarity.toFixed(1)}% Match</text>
      
      <!-- Similarity breakdown -->
      <text x="120" y="385" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="10" font-weight="bold" 
            fill="#9ca3af" dy=".3em">Text ${(textJaccard * 100).toFixed(1)}%</text>
      <text x="200" y="385" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="10" font-weight="bold" 
            fill="#9ca3af" dy=".3em">Hashtag ${(hashtagOverlap * 100).toFixed(1)}%</text>
      <text x="280" y="385" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="10" font-weight="bold" 
            fill="#9ca3af" dy=".3em">Emoji ${(emojiOverlap * 100).toFixed(1)}%</text>
    </svg>
  `;
}

