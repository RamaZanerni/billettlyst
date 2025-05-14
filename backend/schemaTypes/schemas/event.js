export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'date', type: 'datetime', title: 'Dato' },
    { name: 'location', type: 'string', title: 'Sted'},
    { name: 'image', title: 'Image', type: 'image', options: {
        hotspot: true
      }
     
    },
    
    { name: 'apiId', title: 'Ticketmaster API ID', type: 'string' },
    { name: 'category', title: 'Category', type: 'string',
      options: {
 list: [
          {title: 'Musikk', value: 'musikk'},
          {title: 'Sport', value: 'sport'},
          {title: 'Teater/Show', value: 'teater'}
        ]      }
    }
  ],
}