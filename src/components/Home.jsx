import React from 'react'
import SocialLinks from './SocialLinks'
import RichTextResolver from 'storyblok-js-client/dist/rich-text-resolver.cjs'

const Home = ({ data }) => {
  const { homeTagline } = data
  return (
    <div className="md:justify-auto flex min-h-[90vh] flex-col justify-center md:flex-row md:items-center">
      <div className="flex w-full flex-col items-center justify-center md:w-1/2 md:items-start">
        <div className="filter md:hidden">
          <img width={120} height={120} src={`/static/favicon-image.jpg`} className="rounded-full grayscale" />
        </div>
        <h1 className="mt-5 text-2xl font-bold sm:text-5xl md:mt-0">Rishi Raj Jain</h1>
        <h2 className="mt-5 text-center text-lg text-gray-500 dark:text-white sm:text-xl md:text-left">
          Technical Customer Success Manager at Edgio
        </h2>
        <div className="flex flex-row space-x-5">
          <SocialLinks />
        </div>
        <div className="mt-10 h-[1px] w-full bg-gray-200 dark:bg-gray-700"></div>
        <h2
          dangerouslySetInnerHTML={{
            __html: new RichTextResolver().render(homeTagline),
          }}
          className="text-md mt-10 text-center text-gray-500 dark:text-white sm:text-lg md:text-left"
        ></h2>
      </div>
      <div className="hidden flex-col items-end justify-center md:flex md:w-1/2">
        <div className="grayscale filter">
          <img width={330} height={440} className="rounded object-cover" src={`/static/favicon-image.jpg`} />
        </div>
      </div>
    </div>
  )
}

export default Home
