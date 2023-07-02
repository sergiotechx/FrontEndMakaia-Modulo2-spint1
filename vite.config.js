import legacy from "@vitejs/plugin-legacy"
export default{
     server: {
    port: 5050,
    open: '/index.html'
  },
    plugin:[
        legacy({
            targets:['defaults']
        })
    ],
    base:'./'
}