import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { client } from '../lib/sanity'

export default function SanityEventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [users, setUsers] = useState([])

  
const [tmData, setTmData] = useState(null)

useEffect(() => {
  if (event?.apiId) {
    fetch(`https://app.ticketmaster.com/discovery/v2/events/${event.apiId}.json?apikey=c7qLAjGlWre3Sm9jj1V9lpc5Mr5zmlw0`)
      .then(res => res.json())
      .then(setTmData)
  }
}, [event])

  useEffect(() => {
    const fetchData = async () => {
      // Hent event fra Sanity
      const eventQuery = `*[_type == "event" && _id == $id][0]`
      const eventData = await client.fetch(eventQuery, { id })
      setEvent(eventData)

      // Hent brukere som har dette eventet
      const usersQuery = `*[_type == "user" && 
        (references($id) in wishlist || 
        references($id) in previousPurchases)]`
      setUsers(await client.fetch(usersQuery, { id }))
    }
    fetchData()
  }, [id])

  if (!event) return <div>Loading...</div>

  return (
    <div>
      <h1>{event.title}</h1>
      <h2>Users interested in this event:</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}