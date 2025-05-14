import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'ds0qm7um',
  dataset: 'backend',
  apiVersion: '2023-05-03',
  useCdn: false,  
  token: "skVdakzkJzbpHEENUSxHowHStvS0Qt7StXvwnnC4WrPNEUTeJMfXk5DMmRkEB5r5QAgVPrgEXEzZBP1YOQujGzZuAUHkwfHbXllNyPv9cKJRZkueABLtg94GfTovoXYhZKRzTtw24RTXO3Zsod0tr1FGT63emHdXzh0Mi5nE42zR6ccZYLha", // أضف إذا كنت تستخدم صلاحيات محددة
  ignoreBrowserTokenWarning: true ,
  
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)