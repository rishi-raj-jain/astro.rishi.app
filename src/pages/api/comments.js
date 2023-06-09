import firestore from '@/src/lib/firebase/firebase'
import { validateEmail } from '@/src/lib/operations'

export async function get({ request }) {
  try {
    const slug = new URL(request.url).searchParams.get('slug')
    if (!slug)
      return new Response(null, {
        status: 534,
        statusText: 'Not found',
      })
    const commentsRef = firestore.collection('comments')
    const comments = await commentsRef.get()
    const posts = comments.docs
      .map((doc) => doc.data())
      .filter((doc) => doc.slug === slug)
      .map((doc) => {
        const { name, content, time, slug } = doc
        return { name, content, time: time.seconds, slug }
      })
    return new Response(JSON.stringify(posts), {
      status: 200,
    })
  } catch (e) {
    return new Response(null, {
      status: 534,
      statusText: 'Not found',
    })
  }
}

export async function post({ request }) {
  try {
    const { name, slug, content, email } = await request.json()
    let temp = { name, slug, content }
    temp['time'] = firestore.Timestamp.fromDate(new Date())
    if (validateEmail(email)) temp['email'] = email
    const commentsRef = firestore.collection('comments')
    await commentsRef.add(temp)
    return new Response(null, {
      status: 200,
    })
  } catch (e) {
    return new Response(null, {
      status: 534,
      statusText: 'Not found',
    })
  }
}
