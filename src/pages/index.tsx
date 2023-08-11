import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { getList } from "./api/home";
import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { userList } from "../../userList";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

interface Language {
  name: string;
  total_seconds: string;
}

interface UserData {
  running_total: {
    daily_average: number;
    total_seconds: number;
    human_readable_daily_average: number;
    human_readable_total: number;
    languages: Language[];
  };
  user: {
    display_name: string;
    username: string;
    photo: string;
    id: string;
  };
}

export default function Home() {
  const [dataList, setDataList] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  async function getData() {
    setLoading(true);
    try {
      const { data } = await getList(router.query.language as string);
      const totalList = data.data;
      const filterRes = totalList.filter((item: UserData) => {
        const username = item.user.display_name;
        if (userList.includes(username)) {
          return true;
        }
      });
      setLoading(false);
      setDataList(filterRes);
    } catch (err) {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, [router.query.language]);

  const formColumn: ColumnsType<UserData> = [
    {
      title: "排名",
      key: "index",
      dataIndex: "index",
      align: "center",
      width: "80px",
      render: (text, column, idx) => {
        return <span>{Number(idx) + 1}</span>;
      },
    },
    {
      title: "用户",
      key: "userName",
      dataIndex: "user",
      align: "center",
      width: "120px",
      render: (user) => {
        return (
          <div className={styles.user}>
            <Image width={16} height={16} src={user.photo} alt="avatar" />
            <Link href={`https://wakatime.com/${user.display_name}`}>
              {user.display_name}
            </Link>
          </div>
        );
      },
    },
    {
      title: "最近一周摸鱼时长",
      key: "totalTime",
      dataIndex: ["running_total", "human_readable_total"],
      align: "center",
      width: "200px",
    },
    {
      title: "平均每日摸鱼时间",
      key: "averageTime",
      dataIndex: ["running_total", "human_readable_daily_average"],
      align: "center",
      width: "200px",
    },
    {
      title: "摸鱼工具",
      key: "tools",
      dataIndex: ["running_total", "languages"],
      align: "center",
      render: (languages) => {
        let tooMany = false;
        if (languages.length >= 9) {
          languages.splice(9);
          tooMany = true;
        }
        return languages.map((item: Language) => (
          <Link key={item.name} href={`./?language=${item.name}`}>
            <Tag color="blue">{item.name}</Tag>
          </Link>
        ));
      },
    },
  ];

  return (
    <>
      <Head>
        <title>ps摸鱼社</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://wakatime.com/static/img/wakatime.svg" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h2 className={styles.title}>
          <Link href={"/"} legacyBehavior={false}>
            ps摸鱼情况统计
          </Link>
          {router.query.language?.length && (
            <>
              <span>·</span>
              <Link href={`./language=${router.query.language}`}>
                {router.query.language}
              </Link>
            </>
          )}
        </h2>
        <Table
          className={styles.table}
          columns={formColumn}
          dataSource={dataList}
          pagination={false}
          loading={loading}
        ></Table>
      </main>
    </>
  );
}