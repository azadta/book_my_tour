import style from "./create-button.module.css";

interface Props {
  children: React.ReactNode;
  onClick:()=>void
}

const CreateButton = ({ children,onClick }: Props) => {
  return <button onClick={onClick} className={style["create-button"]}> {children}</button>;
};

export default CreateButton;
