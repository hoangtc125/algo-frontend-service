export const formatFileSize = (bytes) => {
    if (bytes < 1024) {
        return bytes + "B";
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + "kB";
    } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(1) + "MB";
    } else {
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + "GB";
    }
}

export const isEmailListValid = (emailList) => {
    // Biểu thức chính quy để kiểm tra mẫu email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (let i = 0; i < emailList.length; i++) {
        if (!emailRegex.test(emailList[i])) {
            return false;
        }
    }

    return true;
}