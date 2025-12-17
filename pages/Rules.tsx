
import React from 'react';

const Rules: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-300">
      <h1 className="text-4xl font-bold text-white mb-8">比賽規則</h1>
      
      <div className="space-y-8">
        <section className="bg-dart-dark p-6 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold text-dart-gold mb-4">01 賽制 (301-501)</h2>
          <div className="space-y-4 text-gray-300">
            <p>遊戲種類包含「301、501」等，內容豐富多樣！由於每個遊戲皆以 "01" 為結尾，因此稱為「01」。</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>所有玩家以一個相同的基本分數開始遊戲 (例如 301 或 501)。</li>
              <li>遊戲玩法由基本分數開始倒扣玩家所射中的得分。</li>
              <li>將基本分數 <span className="text-white font-bold">剛好歸零</span> 即可結鏢，最先結鏢的玩家為勝！</li>
              <li>
                <span className="text-red-400 font-bold">BUST (爆鏢)</span>：當射中的得分大於剩餘分數而減分過頭變成負數時，即稱為 BUST。
                一旦出現 BUST，無論是否投完 3 鏢均須輪替下一位玩家投擲；分數將自動回復為前一回合尚未 BUST 時的分數。
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-dart-dark p-6 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold text-dart-green mb-4">CRICKET (米老鼠)</h2>
          <div className="space-y-4 text-gray-300">
            <p>CRICKET 的有效得分區僅限於 <span className="text-white font-bold">15、16、17、18、19、20 及紅心 (Bullseye)</span>。其餘區域均不予計分。</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <span className="text-dart-gold font-bold">OPEN (佔領陣地)</span>：射中同一有效區域 3 次後，該區域將成為自己的陣地。
                (單倍區計 1 次、雙倍區計 2 次、三倍區計 3 次)
              </li>
              <li>
                <span className="text-red-400 font-bold">CLOSE (關閉陣地)</span>：如果對手也在自己的陣地射中 3 個標記，得分區域便會變成「無效區域」，不予計分。
              </li>
              <li>由「領先狀態下關閉所有陣地者」或「所有回合結束時領先者」為勝。</li>
              <li>只要回合尚未結束且仍有未被佔領的區域時，任何玩家都有可能逆轉局勢，這也正是 CRICKET 的樂趣所在。</li>
            </ul>
          </div>
        </section>
        
        <section className="bg-dart-dark p-6 rounded-xl border border-gray-800">
            <h2 className="text-2xl font-bold text-dart-accent mb-4">賽事禮儀</h2>
            <p>尊重對手。投擲時請保持安靜。賽前賽後請握手致意。請勿在鏢靶區飲食。</p>
        </section>
      </div>
    </div>
  );
};

export default Rules;
