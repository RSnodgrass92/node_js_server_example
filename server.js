//core modules
const http = require("http")
const path = require("path")
const fs= require("fs")

const hostname = "localhost"
const port = 3000

const server = http.createServer((req, res)=> {
    console.log(`Request for ${req.url} by method ${req.method}`)
    
    if(req.method === "GET")
    {
        let fileUrl = req.url; 
        if (fileUrl==="/")
        {
            fileUrl= "/index.html"
        }

        //change the file path to an absolute path
        const filePath = path.resolve("./public" + fileUrl)

        //path.extname returns the file extension
        const fileExt = path.extname(filePath)

        if (fileExt===".html")
        {
            //fs.access lets us know if a file is accessible
            fs.access(filePath, err => {
                if(err)
                {
                    res.statusCode = 404; 
                    res.setHeader("Content-type", "text/html")
                    res.end(`<html><body><h1>Error 404: ${fileUrl}not found</h1></body></html>`)
                    return
                }

                res.statusCode = 200; 
                res.setHeader("Content-Type","text/html")

                //read stream is like lazy loading pipe method is used to connect two stream objects
                //by default when createReadStream is finished reading from the file it will cause the response object (res)
                //to end. So no need to use the res.end() method.
                fs.createReadStream(filePath).pipe(res)
            })
        }

        else
        {
            res.statusCode = 404; 
            res.setHeader("Content-type", "text/html")
            res.end(`<html><body><h1>Error 404: ${fileUrl} is not an HTML file</h1></body></html>`)
        }
    }

    else
    {
        res.statusCode = 404; 
        res.setHeader("Content-type", "text/html")
        res.end(`<html><body><h1>Error 404: ${req.method} not supported </h1></body></html>`)
    }
})

server.listen(port, hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
})