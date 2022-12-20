import { useState } from 'react'

export const getComments = (slug, callBackFunction) => {
  fetch(`/api/comments?slug=${slug}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res) => {
      if (res) callBackFunction(res)
    })
    .catch((e) => {
      console.log(e)
    })
}

export const writeComment = (name, slug, content, email, callBackFunction) => {
  fetch(`/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      slug,
      content,
      email,
    }),
  })
    .then(() => {
      callBackFunction()
    })
    .catch((e) => {
      console.log(e)
    })
}

export const LoadComments = ({ comments }) => {
  return (
    comments &&
    comments
      .sort((a, b) => (new Number(a.time) > new Number(b.time) ? -1 : 1))
      .map((item, index) => (
        <div key={index} className="mt-5 flex w-full flex-col rounded border p-5 dark:border-gray-500">
          <span className="text-lg font-medium text-gray-500 dark:text-gray-300">
            {item.name} &middot; {new Date(1000 * item.time).toLocaleDateString()}
          </span>
          <span className="text-md mt-3 text-gray-500 dark:text-gray-300">{item.content}</span>
        </div>
      ))
  )
}

export const WriteComment = ({ slug, setComments }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        writeComment(name, slug, content, email, () => getComments(slug, setComments))
        setName('')
        setEmail('')
        setContent('')
      }}
      className="mt-10 flex w-full flex-col"
    >
      <h1 className="text-lg font-semibold">Write a comment</h1>
      <div className="flex flex-col items-start sm:flex-row sm:space-x-5">
        <input
          required
          value={name}
          placeholder="Name*"
          onChange={(e) => setName(e.target.value)}
          className="mt-5 w-full appearance-none rounded border px-5 py-2 text-black outline-none ring-0 hover:border-black hover:shadow dark:border-gray-500 dark:bg-black dark:text-gray-300 dark:hover:border-white sm:w-1/2"
        />
        <div className="mt-5 flex w-full flex-col space-y-1 sm:w-1/2">
          <input
            value={email}
            placeholder="Email (Optional)"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full appearance-none rounded border px-5 py-2 text-black outline-none ring-0 hover:border-black hover:shadow dark:border-gray-500 dark:bg-black dark:text-gray-300 dark:hover:border-white"
          />
          <span className="text-sm text-gray-400">Email will remain confidential.</span>
        </div>
      </div>
      <textarea
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={'Comment*\nMaximum of 500 characters.'}
        className="mt-5 appearance-none rounded border px-5 pt-5 pb-10 text-black outline-none ring-0 hover:border-black hover:shadow dark:border-gray-500 dark:bg-black dark:text-gray-300 dark:hover:border-white"
      />
      <button
        type="submit"
        className="mt-5 w-[200px] appearance-none rounded border py-2 px-5 text-center hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-[#28282B]"
      >
        Post a comment
      </button>
    </form>
  )
}

export default function Comments({ data }) {
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
    </>
  )
}
