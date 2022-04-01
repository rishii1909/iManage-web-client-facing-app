import { Button, PageHeader, Table } from "antd";
import router from "next/router";
import { useEffect, useState } from "react";
import { getAccessToken, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout";
import { handle_error } from "../../../helpers/auth";
import { EditOutlined } from "@ant-design/icons";

const profileColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    width: "180px",
    align: "center",
    title: "Actions",
    key: "actions",
    render: (text, record) => (
      <Button
        icon={<EditOutlined />}
        htmlType={"button"}
        onClick={(e) => {
          router.push(`/dashboard/admin/${record.id}/update_profile`);
        }}
      >
        Edit Profile
      </Button>
    ),
  },
];

const ViewAdmins = () => {
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    secure_axios("/team_secrets/getMembers", {}, router, (response) => {
      if (response.accomplished) {
        setProfiles(
          response.response.users
            .filter((user) => user.id != getAccessToken().user_id)
            .map((user, index) => ({
              key: index,
              ...user,
            }))
        );
      } else {
        handle_error(response);
      }

      setLoadingMembers(false);
    });
  }, []);

  return (
    <Dashboard>
      <PageHeader title={"View Profile"}>
        <Table dataSource={profiles} loading={loadingMembers}>
          {profileColumns.map((column) => (
            <Table.Column {...column} />
          ))}
        </Table>
      </PageHeader>
    </Dashboard>
  );
};

export default ViewAdmins;
