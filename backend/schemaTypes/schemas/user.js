export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    { 
      name: 'name', 
      title: 'Name', 
      type: 'string' 
    },
    { 
      name: 'email', 
      title: 'Email', 
      type: 'string' 
    },
    { 
      name: 'age', 
      type: 'number', 
      title: 'Alder' 
    },
    { 
      name: 'gender',
      title: 'Kjønn',
      type: 'string',
      options: {
        list: [
          {title: 'Mann', value: 'male'},
          {title: 'Kvinne', value: 'female'},
          {title: 'Annet', value: 'other'}
        ]
      }
    },
    { 
      name: 'image', 
      type: 'image', 
      title: 'Profilbilde',
      options: {
        hotspot: true
      } 
    },
    { 
      name: 'wishlist', 
      title: 'Ønskeliste', 
      type: 'array', 
      of: [{ type: 'reference', to: [{ type: 'event' }] }] 
    },
    { 
      name: 'previousPurchases', 
      title: 'Tidligere kjøp',
      type: 'array', 
      of: [{ type: 'reference', to: [{ type: 'event' }] }] 
    },
    { 
      name: 'friends', 
      type: 'array', 
      title: 'Venner',
      of: [{ type: 'reference', to: [{ type: 'user' }] }] 
    }
  ]
}