import { PlusCircleOutlined } from "@ant-design/icons";
import {
    Card,
    DatePicker,
    Flex,
    Form,
    Input,
    Modal,
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
        totalMoneyHaving: 1500000,
        expenseList: [],
    },
    {
        id: "2",
        name: "Nha tro",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 2500000,
        expenseList: [],
    },
    {
        id: "3",
        name: "Xang",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 250000,
        expenseList: [],
    },
    {
        id: "4",
        name: "Nuoc uong",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 250000,
        expenseList: [],
    },
    {
        id: "5",
        name: "Do lat vat",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 250000,
        expenseList: [],
    },
    {
        id: "6",
        name: "Di choi cuoi tuan",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 800000,
        expenseList: [],
    },
    {
        id: "7",
        name: "Giat do",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 400000,
        expenseList: [],
    },
    {
        id: "8",
        name: "Quy khong thuong xuyen",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 200000,
        expenseList: [],
    },
    {
        id: "9",
        name: "Phu giup ba me, em",
        totalMoneyExpensing: 0,
        totalMoneyHaving: 1500000,
        expenseList: [],
    },
];

const chooseQuicklyList: ChooseQuicklyItem[] = [
    {
        value: "43000",
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
        value: "100000",
        color: getRandomBrightColor(),
    },
];

const chooseQuicklyListPumped: ChooseQuicklyItem[] = [
    {
        value: "100000",
        color: getRandomBrightColor(),
    },
    {
        value: "200000",
        color: getRandomBrightColor(),
    },
    {
        value: "500000",
        color: getRandomBrightColor(),
    },
    {
        value: "1000000",
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
        form.resetFields()
        message.success("Them chi tieu thanh cong");
    };
    const handleChooseQuickly = (value: string) => {
        form.setFieldValue("cost", value);
    };

    // Pumped Money
    const [formPumped] = Form.useForm();
    const [saveMoney, setSavingMoney] = useLocalStorage<SavingMoney>(
        "saving-money",
        { total: 500000, current: 500000, historyList: [] }
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
        formPumped.resetFields()
        message.success("Bom tien thanh cong");
    };

    const handleSubmitPumpedMoney = () => {
        formPumped.submit();
    };

    // Add saving money
    const handleChangeSavingMoney = (value: string) => {
        setSavingMoney(prev => ({...prev, total: prev.total + +value, current: prev.current + +value}))
        message.success("Them tien tiet kiem thanh cong!")
    };
    return (
        <>
            <Card
                title="Quan ly chi tieu"
                style={{ width: "100%" }}
                extra={
                    <Flex gap={20} align="center" justify="center">
                        <BackupButton/>
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
                            Bơm tiền
                        </span>
                        <span>Tien tiet kiem</span>
                        <Typography.Paragraph
                            style={{ marginBottom: 0 }}
                            editable={{
                                onChange: handleChangeSavingMoney,
                            }}
                        >
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
                                            item.totalMoneyLast ||
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
                                onClick={() => handleChooseQuicklyPumped(item.value)}
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
        </>
    );
}
