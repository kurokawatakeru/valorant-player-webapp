import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-xl p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">データで紡ぐVALORANTプロの成長物語</h1>
          <p className="text-xl mb-8">
            選手の軌跡をデータで可視化し、単なる統計ではなく「物語」として伝えるプラットフォーム
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/players" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold transition-colors duration-300"
            >
              選手を探す
            </Link>
            <a 
              href="#featured" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-full font-semibold transition-colors duration-300"
            >
              特集ストーリーを見る
            </a>
          </div>
        </div>
      </div>
      
      {/* 注目選手セクション */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">注目の選手</h2>
          <Link to="/players" className="text-blue-500 hover:underline">
            すべて見る &gt;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* 注目選手カード（サンプル） */}
          {['24210', '8329', '36560', '29547'].map((id, index) => (
            <Link 
              key={id} 
              to={`/players/${id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-40 bg-gray-200">
                {/* 実際の実装では選手の画像を表示 */}
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                  選手画像
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">注目選手 {index + 1}</h3>
                <div className="text-sm text-gray-600 mb-2">チーム名</div>
                <div className="text-xs text-gray-500">
                  最近の活躍: 国際大会で優勝
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* 最新の成長ストーリーセクション */}
      <section className="mb-16" id="featured">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">最新の成長ストーリー</h2>
          <a href="#" className="text-blue-500 hover:underline">
            すべて見る &gt;
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 成長ストーリーカード（サンプル） */}
          {[1, 2].map((id) => (
            <div key={id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto bg-gray-200">
                {/* 実際の実装ではストーリーのサムネイル画像を表示 */}
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                  サムネイル
                </div>
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="text-xl font-bold mb-2">Depの7年間の軌跡 - CS:GOからVALORANTへ</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  日本VALORANTシーンを代表するプレイヤーの一人、Depの成長ストーリー。CS:GO時代の下積み期から、VALORANTでの国際的な活躍まで、データで見るキャリアの変遷。
                </p>
                <a href="#" className="text-blue-500 hover:underline">
                  続きを読む &gt;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* 特集コンテンツセクション */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">特集コンテンツ</h2>
          <a href="#" className="text-blue-500 hover:underline">
            すべて見る &gt;
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 h-64 md:h-auto bg-gray-200">
              {/* 実際の実装では特集の画像を表示 */}
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                特集画像
              </div>
            </div>
            <div className="p-6 md:w-1/2">
              <h3 className="text-2xl font-bold mb-2">日本VALORANTシーンの発展</h3>
              <p className="text-gray-600 mb-4">
                2020年のゲームリリースから現在まで、日本のVALORANTシーンはどのように発展してきたのか。
                主要選手のパフォーマンス推移と国際大会での成績から、日本チームの成長と今後の展望を分析します。
              </p>
              <a href="#" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300">
                特集を読む
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* サイト説明セクション */}
      <section className="bg-gray-50 rounded-lg p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">VALORANTプレイヤー成長ストーリーサイトについて</h2>
          <p className="text-gray-600 mb-6 text-center">
            当サイトは、VALORANTプロプレイヤーの成長過程をデータで可視化し、
            単なる統計ではなく「物語」として伝えることを目指しています。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="font-bold mb-2">感情的価値</h3>
              <p className="text-gray-600">
                ファンにとって推し選手の成長が見える、共感できるストーリー体験を提供します。
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="font-bold mb-2">発見価値</h3>
              <p className="text-gray-600">
                知らなかった選手の過去や、成長の転機となった試合を発見できます。
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="font-bold mb-2">比較価値</h3>
              <p className="text-gray-600">
                似たような軌跡の選手を発見し、異なる選手間の成長パターンを比較できます。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
