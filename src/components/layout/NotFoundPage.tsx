import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users } from 'lucide-react';

const NotFoundPage: React.FC = memo(() => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl sm:text-4xl font-bold text-white">404</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            ページが見つかりません
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
            お探しのページは存在しないか、移動した可能性があります。
            URLを確認するか、ホームページに戻ってください。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            ホームに戻る
          </Link>
          <Link
            to="/players"
            className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            選手一覧を見る
          </Link>
        </div>
      </div>
    </div>
  );
});

NotFoundPage.displayName = 'NotFoundPage';

export default NotFoundPage;
