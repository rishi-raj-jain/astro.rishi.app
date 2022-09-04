import { useState } from 'react'

export default function SearchBar({ content }) {
  const [searcValue, setSearcValue] = useState('')
  const [results, setResults] = useState(content)
  return (
    <div className="relative mt-5">
      <input
        value={searcValue}
        onChange={(e) => {
          setSearcValue(e.target.value)
          if (e.target.value.length > 0) {
            setResults(
              content.filter((item) => {
                return (
                  item.content.title.includes(searcValue) || item.content.intro.includes(searcValue) || item.content.long_text.includes(searcValue)
                )
              })
            )
          }
        }}
        placeholder="Search Posts..."
        className="w-1/2 rounded-lg border bg-white py-2 px-5 text-sm outline-none dark:border-gray-600 dark:bg-black"
      />
      {searcValue.length > 0 && results.length > 0 && (
        <div className="top-10 mt-2 shadow">
          {results.map((item) => (
            <a key={item.slug} href={`/blog/${item.slug}`}>
              <div className="flex flex-col border-t py-3 px-5">
                <span className="text-md py-1 font-bold">{item.content.title}</span>
                <span className="py-1 text-sm">{item.content.intro}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
