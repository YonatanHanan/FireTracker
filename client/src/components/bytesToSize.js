export default function(bytes) {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) 
        return 'n/a';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) 
        return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};