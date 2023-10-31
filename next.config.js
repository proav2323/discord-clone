/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
       config.externals.push({
        "utf-8-validate": "commanjs utfs-8-validate",
        bufferutil: "commonjs bufferutil"
       })

       return config;
    },
    images: {
        domains: ["uploadthing.com", "utfs.io"]
    }
}

module.exports = nextConfig
