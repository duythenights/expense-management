export function removeCharacterButNumber(inputString:string) {
    return inputString?.replace(/\D/g, '');
}
export function getRandomBrightColor() {
    // Tạo ra giá trị ngẫu nhiên cho R, G, B trong khoảng từ 128 đến 255
    let r = Math.floor(Math.random() * 128 + 128);
    let g = Math.floor(Math.random() * 128 + 128);
    let b = Math.floor(Math.random() * 128 + 128);

    // Chuyển đổi giá trị R, G, B thành mã hex
    return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}