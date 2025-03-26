import React from "react";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  const recommendedTopics = [
    { name: "Programming", slug: "programming" },
    { name: "Self Improvement", slug: "self-improvement" },
    { name: "Data Science", slug: "data-science" },
    { name: "Writing", slug: "writing" },
    { name: "Technology", slug: "technology" },
    { name: "Relationships", slug: "relationships" },
    { name: "Politics", slug: "politics" },
  ];

  const whoToFollow = [
    {
      id: 1,
      name: "Michelle Wiles",
      bio: "Breaking down brands and strategy. CEO of Embedded",
      picture: "https://via.placeholder.com/40",
      verified: true,
    },
    {
      id: 2,
      name: "Netflix TechBlog",
      bio: "Publication",
      picture: "https://via.placeholder.com/40",
      description: "Learn about Netflix's world class engineering efforts",
    },
    {
      id: 3,
      name: "John DeVore",
      bio: "My memoir 'Theatre Kids: A True Tale of Off-Off Broadway'",
      picture: "https://via.placeholder.com/40",
      verified: true,
    },
  ];

  return (
    <div className="w-full">
      {/* Recommended Topics */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <h3 className="text-lg font-bold mb-3">Recommended topics</h3>
        <div className="flex flex-wrap gap-2">
          {recommendedTopics.map((topic) => (
            <Link
              key={topic.slug}
              to={`/topics/${topic.slug}`}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              {topic.name}
            </Link>
          ))}
        </div>
        <Link to="/topics" className="text-sm text-gray-500 block mt-3">
          See more topics
        </Link>
      </div>

      {/* Who to Follow */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <h3 className="text-lg font-bold mb-3">Who to follow</h3>
        <div className="space-y-4">
          {whoToFollow.map((profile) => (
            <div key={profile.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={profile.picture}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{profile.name}</span>
                    {profile.verified && (
                      <span className="ml-1 text-blue-600">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{profile.bio}</p>
                </div>
              </div>
              <button className="text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100">
                Follow
              </button>
            </div>
          ))}
        </div>
        <Link
          to="/recommendations"
          className="text-sm text-gray-500 block mt-3"
        >
          See more suggestions
        </Link>
      </div>

      {/* Recently Saved */}
      {/* <div className="bg-white rounded-lg p-4">
        <h3 className="text-lg font-bold mb-3">Recently saved</h3>
        {savedPosts.length > 0 ? (
          <div className="space-y-3">
            {savedPosts.map((post) => {
              console.log("Post object:", post);
              console.log("CreatedAt field:", post.createdAt);

              const createdAt = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "Date not available";

              return (
                <Link key={post.id} to={`/posts/${post.id}`} className="block">
                  <h4 className="font-medium hover:underline">{post.title}</h4>
                  <p className="text-xs text-gray-500">{createdAt}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No saved posts yet.</p>
        )}
        <Link to="/saved-posts" className="text-sm text-gray-500 block mt-3">
          See all ({savedPosts.length})
        </Link>
      </div> */}
    </div>
  );
};

export default RightSidebar;
