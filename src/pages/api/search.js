import { getAllPostsForHome } from '@/src/api'

export async function post({ request }) {
  try {
    const { text } = await request.json()
    if (!text) {
      return new Response(JSON.stringify({ e: 'Please enter a valid search text.' }), {
        status: 200,
      })
    }

    let data = []

    try {
      data = await getAllPostsForHome()
    } catch (eGetPost) {
      console.log(eGetPost)
    }

    if (!data || data.length < 1) {
      return new Response(JSON.stringify({ e: 'No results found. Please try searching with another keyword.' }), {
        status: 200,
      })
    }

    try {
      data = data.filter((item) => {
        return item.content.title.includes(text) || item.content.intro.includes(text) || item.content.long_text.includes(text)
      })
    } catch (eFilterPost) {
      console.log(eFilterPost)
    }

    if (!data || data.length < 1) {
      return new Response(JSON.stringify({ e: 'No results found. Please try searching with another keyword.' }), {
        status: 200,
      })
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
    })
  } catch (etop) {
    console.log(etop.message)
    return new Response(JSON.stringify({ e: 'There was an error with search api. Please report this incident.' }), {
      status: 200,
    })
  }
}
