
export async function getEventDetails(eventId, apiKey) {
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch event details');
    const data = await response.json();
    
    return {
      title: data.name,
      date: data.dates.start.dateTime,
      location: data._embedded?.venues?.[0]?.name || 'Unknown venue',
      imageUrl: data.images?.find(img => img.ratio === '16_9')?.url || '',
      description: data.info || '',
      category: data.classifications?.[0]?.genre?.name || 'Music'
    };
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
}