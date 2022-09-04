import Heart from './Heart'
import RichTextResolver from 'storyblok-js-client/dist/rich-text-resolver.cjs'

const TimelineItem = ({ Title, Description }) => {
  return (
    <div className="relative mt-5 flex flex-row items-start space-x-5">
      <div className="mt-1 h-[12px] w-[12px]">
        <Heart width={12} height={21} />
      </div>
      <div className="flex flex-col">
        <span className="text-md font-semibold sm:text-lg">{Title}</span>
        <span
          className="dark:text-gray-400"
          dangerouslySetInnerHTML={{
            __html: new RichTextResolver().render(Description),
          }}
        ></span>
      </div>
    </div>
  )
}

export default TimelineItem
