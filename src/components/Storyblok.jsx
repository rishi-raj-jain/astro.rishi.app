import React from 'react'

const Storyblok = ({ data }) => {
  return (
    <div className="flex w-full flex-col items-center text-[14px]">
      <div className="mt-10 flex w-[90vw] max-w-[540px] flex-col">
        <h2 className="text-3xl font-bold text-zinc-700 dark:text-gray-300">Rishi Raj Jain</h2>
        <h2 id="About" className="mt-10 text-zinc-700 dark:text-gray-300">
          About
        </h2>
        <p className="mt-2 font-light text-slate-600 dark:text-slate-400">
          Rishi is a{' '}
          <a target="_blank" className="text-black underline dark:text-slate-200" href="https://storyblok.com">
            Storyblok Ambassador
          </a>
          , since Sept. 2021.
        </p>
      </div>
      {Object.keys(data).map((i) => (
        <div key={i} className="mt-10 flex w-[90vw] max-w-[540px] flex-col gap-y-5">
          <h2 id={i} className="text-zinc-700 dark:text-gray-300">
            {i}
          </h2>
          {data[i].map((j, _ind) => (
            <div key={_ind} className="flex flex-col gap-y-2 gap-x-10 md:flex-row md:gap-y-0">
              <p className="min-w-[100px] font-light text-gray-400">{j.name}</p>
              <a
                target="_blank"
                href={j.href || '#'}
                className="flex flex-row items-center justify-start font-light text-black hover:underline dark:text-slate-200"
              >
                {j.title} &#x2197;
              </a>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Storyblok
