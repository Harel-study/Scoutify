import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-dark-800 border border-dark-700 p-5 rounded-2xl animate-pulse space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-dark-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-dark-700 rounded w-1/3"></div>
          <div className="h-3 bg-dark-700 rounded w-1/4"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-dark-700 rounded w-full"></div>
        <div className="h-4 bg-dark-700 rounded w-5/6"></div>
      </div>
      <div className="h-40 bg-dark-700 rounded-xl w-full"></div>
      <div className="flex justify-between pt-2">
        <div className="h-4 bg-dark-700 rounded w-16"></div>
        <div className="h-4 bg-dark-700 rounded w-16"></div>
      </div>
    </div>
  );
};

export const JobSkeleton: React.FC = () => {
  return (
    <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-dark-700 rounded w-1/2"></div>
          <div className="h-4 bg-dark-700 rounded w-1/4"></div>
        </div>
        <div className="w-12 h-12 bg-dark-700 rounded-xl"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-dark-700 rounded w-full"></div>
        <div className="h-3 bg-dark-700 rounded w-5/6"></div>
      </div>
      <div className="flex space-x-2 pt-2">
        <div className="h-6 bg-dark-700 rounded-full w-20"></div>
        <div className="h-6 bg-dark-700 rounded-full w-24"></div>
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl animate-pulse">
      <div className="h-32 bg-dark-700 rounded-t-2xl"></div>
      <div className="px-6 pb-6 relative">
        <div className="w-24 h-24 bg-dark-600 rounded-full border-4 border-dark-800 absolute -top-12 left-6"></div>
        <div className="pt-16 space-y-4">
          <div className="space-y-2">
            <div className="h-6 bg-dark-700 rounded w-1/3"></div>
            <div className="h-4 bg-dark-700 rounded w-1/4"></div>
          </div>
          <div className="h-3 bg-dark-700 rounded w-full"></div>
          <div className="h-3 bg-dark-700 rounded w-2/3"></div>
          <div className="border-t border-dark-700 pt-4 flex justify-around">
            <div className="text-center space-y-1">
              <div className="h-5 bg-dark-700 rounded w-12 mx-auto"></div>
              <div className="h-3 bg-dark-700 rounded w-16 mx-auto"></div>
            </div>
            <div className="text-center space-y-1">
              <div className="h-5 bg-dark-700 rounded w-12 mx-auto"></div>
              <div className="h-3 bg-dark-700 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SidebarSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 bg-dark-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-dark-700 rounded w-1/2"></div>
            <div className="h-3 bg-dark-700 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
