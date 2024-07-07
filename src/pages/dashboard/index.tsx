import { PlusCircleOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    DatePicker,
    Flex,
    Form,
    Input,
    List,
    Modal,
    Popconfirm,
    Select,
    Tag,
    Typography,
    message,
} from "antd";
import dayjs from "dayjs";
import numeral from "numeral";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { getRandomBrightColor } from "../../utils";
import BackupButton from "../../components/backup-button";

type ExpenseItem = {
    fundId: string;
    detail?: string;
    cost: number;
    date?: string;
};

type PumpedMoneyItem = {
    fundId: string;
    detail?: string;
    money: number;
    date?: string;
};

type SavingMoney = {
    total: number;
    current: number;
    historyList: PumpedMoneyItem[];
};

type FundType = {
    id: string;
    name: string;
    totalMoneyHaving: number;
    totalMoneyExpensing: number;
    totalMoneyLast?: number;
    expenseList: ExpenseItem[];
};

type ChooseQuicklyItem = { value: string; color: string };

const defaultFund: FundType[] = [
    {
        id: "1",
        name: "An Uong",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 0,
        expenseList: [],
    },
    {
        id: "2",
        name: "Nha tro",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 0,
        expenseList: [],
    },
    {
        id: "3",
        name: "Xang",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 0,
        expenseList: [],
    },
    {
        id: "4",
        name: "Nuoc uong",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 0,
        expenseList: [],
    },
    {
        id: "5",
        name: "Do lat vat",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 0,
        expenseList: [],
    },
    {
        id: "6",
        name: "Di choi cuoi tuan",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 0,
        expenseList: [],
    },
    {
        id: "7",
        name: "Giat do",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 0,
        expenseList: [],
    },
    {
        id: "8",
        name: "Quy khong thuong xuyen",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 0,
        expenseList: [],
    },
    {
        id: "9",
        name: "Phu giup ba me, em",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 0,
        expenseList: [],
    },
];

const chooseQuicklyList: ChooseQuicklyItem[] = [
    {
        value: "40000",
        color: getRandomBrightColor(),
    },
    {
        value: "45000",
        color: getRandomBrightColor(),
    },

    {
        value: "56000",
        color: getRandomBrightColor(),
    },
    {
        value: "60000",
        color: getRandomBrightColor(),
    },
    {
        value: "100000",
        color: getRandomBrightColor(),
    },
    {
        value: "200000",
        color: getRandomBrightColor(),
    },
];

const chooseQuicklyListPumped: ChooseQuicklyItem[] = [
    {
        value: "200000",
        color: getRandomBrightColor(),
    },
    {
        value: "250000",
        color: getRandomBrightColor(),
    },
    {
        value: "400000",
        color: getRandomBrightColor(),
    },
    {
        value: "1500000",
        color: getRandomBrightColor(),
    },
    {
        value: "2500000",
        color: getRandomBrightColor(),
    },
];

export default function DashboardPage() {
    // Expense
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useLocalStorage<FundType[]>(
        "fund-value",
        defaultFund
    );

    const handleSubmit = () => {
        form.submit();
    };
    const handleAddExpense = () => {
        const formValues: ExpenseItem = form.getFieldsValue();

        const clone = [...value];

        clone.forEach((item) => {
            if (item.id === formValues.fundId) {
                item.totalMoneyExpensing += +formValues.cost;
                item.totalMoneyLast =
                    +item.totalMoneyHaving - +item.totalMoneyExpensing;
                item.expenseList.push({
                    ...formValues,
                    date: dayjs(formValues.date).format("DD-MM-YYYY"),
                });
            }
        });
        setValue(clone);
        setIsModalOpen(false);
        form.resetFields();
        message.success("Them chi tieu thanh cong");
    };
    const handleChooseQuickly = (value: string) => {
        form.setFieldValue("cost", value);
    };

    // Pumped Money
    const [formPumped] = Form.useForm();
    const [saveMoney, setSavingMoney] = useLocalStorage<SavingMoney>(
        "saving-money",
        { total: 0, current: 0, historyList: [] }
    );

    const [isModalPumpedMoneyOpen, setIsModalPumpedMoneyOpen] = useState(false);

    const handleChooseQuicklyPumped = (value: string) => {
        formPumped.setFieldValue("money", value);
    };
    const handlePumpedMoney = () => {
        const formValues: PumpedMoneyItem = formPumped.getFieldsValue();

        const cloneValue = [...value];
        const cloneSaving = { ...saveMoney };
        cloneValue.forEach((item) => {
            if (item.id === formValues.fundId) {
                item.totalMoneyHaving =
                    +item.totalMoneyHaving + +formValues.money;
                cloneSaving.current = saveMoney.current - +formValues.money;
                cloneSaving.historyList.push({
                    ...formValues,
                    date: dayjs(formValues.date).format("DD-MM-YYYY"),
                });
            }
        });

        setValue(cloneValue);
        setSavingMoney(cloneSaving);
        setIsModalPumpedMoneyOpen(false);
        formPumped.resetFields();
        message.success("Bom tien thanh cong");
    };

    const handleSubmitPumpedMoney = () => {
        formPumped.submit();
    };

    // Add saving money
    const [isModalSavingOpen, setIsModalSavingOpen] = useState(false);
    const [formSaving] = Form.useForm();

    const onSubmitFormSaving = () => formSaving.submit();
    const handleChangeSavingMoney = () => {
        const value = formSaving.getFieldValue("money");
        setSavingMoney((prev) => ({
            ...prev,
            total: prev.total + +value,
            current: prev.current + +value,
        }));
        setIsModalSavingOpen(false);
        formSaving.resetFields();
        message.success("Bom tien tiet kiem thanh cong!");
    };

    // Detail fund
    const [detailData, setDetailData] = useState<ExpenseItem[] | undefined>([]);
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const handleOpenDetail = (fundId: string) => {
        setIsOpenDetail(true);
        const data = value.find((item) => item.id === fundId)?.expenseList;
        setDetailData(data);
    };
    return (
        <>
            <Card
                title="Quan ly chi tieu"
                style={{ width: "100%" }}
                extra={
                    <Flex gap={20} align="center" justify="center">
                        <Popconfirm
                            title="Reset lai cac quy"
                            description="Ban thuc su muon thuc hien chu?"
                            onConfirm={() => setValue(defaultFund)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>reset</Button>
                        </Popconfirm>
                        <BackupButton />
                        <span
                            style={{
                                backgroundColor: "#108ee9",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                border: "1px dashed blue",
                                cursor: "pointer",
                            }}
                            onClick={() => setIsModalPumpedMoneyOpen(true)}
                        >
                            Bơm tiền quỹ
                        </span>
                        <Button onClick={() => setIsModalSavingOpen(true)}>
                            Bơm tiền tiết kiệm
                        </Button>
                        <Typography.Paragraph style={{ marginBottom: 0 }}>
                            {numeral(saveMoney.current).format("0,0")}
                        </Typography.Paragraph>
                        <PlusCircleOutlined
                            style={{
                                fontSize: "30px",
                                color: "#108ee9",
                                cursor: "pointer",
                            }}
                            onClick={() => setIsModalOpen(true)}
                        />
                    </Flex>
                }
            >
                <Flex wrap justify="space-between" gap={20}>
                    {value?.map((item) => (
                        <Card
                            key={item.name}
                            type="inner"
                            title={item.name}
                            bordered={true}
                            style={{
                                width: "calc(100% / 4 - 30px)",
                                minWidth: "300px",
                            }}
                            extra={
                                <Button
                                    type="dashed"
                                    style={{ color: "green" }}
                                    onClick={() => handleOpenDetail(item.id)}
                                >
                                    Lich su
                                </Button>
                            }
                        >
                            <Flex vertical justify="flex-start" gap={10}>
                                <Tag
                                    color="green"
                                    style={{
                                        padding: "20px",
                                        fontSize: "14px",
                                    }}
                                >
                                    <Flex justify="space-between">
                                        <span>Tong ngan sach: </span>
                                        {numeral(item.totalMoneyHaving).format(
                                            "0,0"
                                        )}
                                    </Flex>
                                </Tag>
                                <Tag
                                    color="red"
                                    style={{
                                        padding: "20px",
                                        fontSize: "14px",
                                    }}
                                >
                                    <Flex justify="space-between">
                                        <span>Tong chi: </span>
                                        {numeral(
                                            item.totalMoneyExpensing
                                        ).format("0,0")}
                                    </Flex>
                                </Tag>
                                <Tag
                                    color="blue"
                                    style={{
                                        padding: "20px",
                                        fontSize: "14px",
                                    }}
                                >
                                    <Flex justify="space-between">
                                        <span>Con lai: </span>
                                        {numeral(
                                            (item.totalMoneyHaving - item.totalMoneyExpensing ) ||
                                                item.totalMoneyHaving
                                        ).format("0,0")}
                                    </Flex>
                                </Tag>
                            </Flex>
                        </Card>
                    ))}
                </Flex>
            </Card>

            <Modal
                title="Them chi tieu"
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form
                    form={form}
                    onFinish={handleAddExpense}
                    initialValues={{ fundId: "1", cost: "100000" }}
                >
                    <Flex
                        style={{
                            margin: "10px 0",
                            cursor: "pointer",
                            width: "max-content",
                        }}
                    >
                        {chooseQuicklyList.map((item) => (
                            <Tag
                                style={{
                                    border: "1px dashed #999",
                                    color: "#000",
                                }}
                                key={item.value}
                                color={item.color}
                                onClick={() => handleChooseQuickly(item.value)}
                            >
                                {item.value}
                            </Tag>
                        ))}
                    </Flex>
                    <Form.Item
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "So tien khong duoc bo trong",
                            },
                        ]}
                        name={"cost"}
                    >
                        <Input placeholder="So tien ban da chi" />
                    </Form.Item>
                    <Form.Item name={"fundId"}>
                        <Select
                            options={value?.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                        ></Select>
                    </Form.Item>

                    <Form.Item
                        name={"date"}
                        rules={[
                            { required: true, message: "Vui long chon ngay" },
                        ]}
                    >
                        <DatePicker
                            showNow
                            placeholder="Chon ngay"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item hasFeedback name={"detail"}>
                        <Input placeholder="ghi chu" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Bom them tien"
                open={isModalPumpedMoneyOpen}
                onOk={handleSubmitPumpedMoney}
                onCancel={() => setIsModalPumpedMoneyOpen(false)}
            >
                <Form
                    form={formPumped}
                    onFinish={handlePumpedMoney}
                    initialValues={{ fundId: "1", cost: "100000" }}
                >
                    <Flex
                        style={{
                            margin: "10px 0",
                            cursor: "pointer",
                            width: "max-content",
                        }}
                    >
                        {chooseQuicklyListPumped.map((item) => (
                            <Tag
                                style={{
                                    border: "1px dashed #999",
                                    color: "#000",
                                }}
                                key={item.value}
                                color={item.color}
                                onClick={() =>
                                    handleChooseQuicklyPumped(item.value)
                                }
                            >
                                {item.value}
                            </Tag>
                        ))}
                    </Flex>
                    <Form.Item
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "So tien khong duoc bo trong",
                            },
                        ]}
                        name={"money"}
                    >
                        <Input placeholder="So tien muon bom" />
                    </Form.Item>
                    <Form.Item name={"fundId"}>
                        <Select
                            options={value?.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                        ></Select>
                    </Form.Item>

                    <Form.Item
                        name={"date"}
                        rules={[
                            { required: true, message: "Vui long chon ngay" },
                        ]}
                    >
                        <DatePicker
                            showNow
                            placeholder="Chon ngay"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item hasFeedback name={"detail"}>
                        <Input placeholder="ghi chu" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Bom tien tiet kiem"
                open={isModalSavingOpen}
                onOk={onSubmitFormSaving}
                onCancel={() => setIsModalSavingOpen(false)}
            >
                <Form form={formSaving} onFinish={handleChangeSavingMoney}>
                    <Form.Item
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "So tien khong duoc bo trong",
                            },
                        ]}
                        name={"money"}
                    >
                        <Input placeholder="So tien muon bom" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Bom tien tiet kiem"
                open={isOpenDetail}
                onOk={onSubmitFormSaving}
                onCancel={() => setIsOpenDetail(false)}
                footer
            >
                <List
                    bordered
                    dataSource={detailData}
                    renderItem={(item) => (
                        <List.Item title={'hello'} key={(item?.detail || '1') + (item?.date || '0') + item.cost} style={{display:'flex', flexDirection:"column", justifyContent:'flex-start', alignItems:"flex-start", gap:"10px"}}>
                            <Tag color="cyan">{item.date}</Tag>
                            <div>

                            <Typography.Text mark>
                                [{numeral(item.cost).format("0,0")}]
                            </Typography.Text>{" "}
                            {item.detail || 'n/a'}
                            </div>
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
}
