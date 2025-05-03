import { motion } from 'framer-motion';

const MissionCard = ({ icon: Icon, title, description, tag, tagIcon: TagIcon, variants }) => {
  return (
    <motion.div
      variants={variants}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
    >
      <div className="flex flex-col items-center text-center mb-6 flex-grow">
        <div className="p-3 bg-opacity-20 rounded-full mb-4">
          <Icon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
      
      <div className="flex justify-center mt-auto">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-opacity-20">
          {TagIcon && <TagIcon className="w-4 h-4 mr-1" />}
          {tag}
        </span>
      </div>
    </motion.div>
  );
};

// Prop types for better development
MissionCard.defaultProps = {
  tagIcon: null,
};

export default MissionCard;