const MorePosts = ({ morePosts }) => {
  const filteredPosts = morePosts.filter((item) => item.hasOwnProperty('name'))
  return (
    filteredPosts.length > 0 && (
      <div className="flex flex-col">
        <div className="mt-10 mb-5 text-sm">
          <span> More Posts &rarr; </span>
        </div>
        {filteredPosts.map((item) => (
          <a key={item.slug} href={`/blog/${item.slug}`} className="mb-5 block w-full text-lg font-bold hover:underline">
            {item.name}
          </a>
        ))}
      </div>
    )
  )
}

export default MorePosts
