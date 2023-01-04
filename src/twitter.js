import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

dotenv.config()

export const getAuthorInfo = (tweets, author_id) => {
  return tweets.includes.users.find((user) => user.id === author_id)
}

export const getMedia = (tweets, media_id) => {
  return tweets.includes.media.find((media) => media.media_key === media_id)
}

export const getTweet = async (id) => {
  const queryParams = new URLSearchParams({
    ids: (typeof id === 'string' ? [id] : id).join(','),
    'tweet.fields': 'attachments,author_id,created_at,referenced_tweets',
    'media.fields': 'preview_image_url,url',
    expansions: 'attachments.media_keys,author_id',
    'user.fields': 'profile_image_url,username',
  })
  const response = await fetch(`https://api.twitter.com/2/tweets?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_API_KEY}`,
    },
  })
  if (response.ok) {
    const tweets = await response.json()
    return tweets
  } else {
    console.log(await response.text())
  }
  return { data: [] }
}
