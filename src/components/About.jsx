import React from 'react'
import TimelineItem from './TimelineItem'
import RichTextResolver from 'storyblok-js-client/dist/rich-text-resolver.cjs'

const About = ({ data }) => {
  const { aboutTagline, Timeline } = data
  return (
    <>
      <h1 className="text-2xl font-bold sm:text-5xl">About Me</h1>
      <h2
        dangerouslySetInnerHTML={{
          __html: new RichTextResolver().render(aboutTagline),
        }}
        className="font-regular text-md mt-5 whitespace-pre-line dark:text-gray-400 sm:text-xl"
      />
      <h1 className="mt-16 text-2xl font-bold sm:text-5xl">My Timeline</h1>
      {Object.keys(Timeline)
        .sort((a, b) => (a > b ? -1 : 1))
        .map((item) => (
          <div className="mt-8 flex flex-col" key={item}>
            <span className="text-lg font-bold">{item}</span>
            {Timeline[item].map((exp) => (
              <TimelineItem key={exp.content.Title} {...exp['content']} />
            ))}
          </div>
        ))}
    </>
  )
}

export default About
