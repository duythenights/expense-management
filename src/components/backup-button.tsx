import { Button } from "antd";

const handleBackup = (key: string) => {
    const data = localStorage.getItem(key); // Thay 'yourDataKey' bằng key bạn đã sử dụng để lưu dữ liệu

    const jsonData = JSON.stringify(data);

    const blob = new Blob([jsonData], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-${key}-${new Date().getMilliseconds.toString()}.json`;
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(url);
};
const BackupButton = () => {
    return (
        <>
            <Button onClick={() => handleBackup("fund-value")}>
                Sao lưu fund
            </Button>
            <Button onClick={() => handleBackup("saving-money")}>
                Sao lưu saving
            </Button>
        </>
    );
};

export default BackupButton;
