import Editor from "components/Editor";
import { GetServerSideProps, NextPage } from "next";
import { resetServerContext } from "react-beautiful-dnd";
import styles from "styles/pages/Editor.module.scss";

const EditorPage: NextPage = () => {
  return <div className={styles.container}>
    <Editor className={styles.editor}></Editor>
  </div>
}

export const getServerSideProps: GetServerSideProps = async () => {
  resetServerContext();
  return {props: { data : []}}
}

export default EditorPage;