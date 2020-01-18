### Compress your images
> 使用Typescript 重构 Compress your images

### Important
> 由于安装的tinify源代码有问题，所以run和build需要修改一下: (
- serve注意事项：
  安装依赖之后直接运行会报错：
    > Error: ENOENT: no such file or directory, open '${rootPath}\dist_electron/../data/cacert.pem'
  
  尝试解决无果之后，将node_modules/tinify/lib/tinify/Client.js下的第10行修改如下即可：
  ```javascript
    const data = fs.readFileSync(`node_modules/tinify/lib/data/cacert.pem`).toString();
  ```

- windows build注意事项：
  build之后直接安装依然会报错文件找不到，windows客户端打开win-unpacked下的.ext文件报错:
    > Error: ENOENT:no such file or directory, open 'node_modules/tinify/lib/data/cacert.pem'

  1. 还原serve步骤的操作（node_modules/tinify/lib/tinify/Client.js下的第10行还原）
  2. 执行：

  ```javascript
    yarn sh
  ```
  3. 这时，项目打包好的文件依然还是有问题，但是直接打开win-unpacked下的.ext文件不会报错,可以再使用第三方工具进行安装- -
  4. 如果还不行，删除dist_electron目录重试一下-_-|||

- mac build报错暂未解决: (
