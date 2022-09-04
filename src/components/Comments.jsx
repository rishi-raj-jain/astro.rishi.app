import { useState } from 'react'
import MorePosts from './blog/more-posts'
import WriteComment, { LoadComments, getComments } from './blog/comments'

export default function Comments({ data, morePosts }) {
  const [comments, setComments] = useState([])
  return (
    <>
      <WriteComment setComments={setComments} slug={data.post.slug} />
      <div className="mt-10 w-full border-t pt-10 dark:border-gray-500">
        <button
          onClick={() => getComments(data.post.slug, setComments)}
          className="w-[200px] appearance-none rounded border py-2 px-5 text-center hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-[#28282B]"
        >
          Load Comments
        </button>
      </div>
      <LoadComments comments={comments} />
      <MorePosts morePosts={morePosts} />
    </>
  )
}
