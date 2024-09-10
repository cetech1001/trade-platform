interface IProps {
  toggleSidebar(): void;
}

export const Home = (props: IProps) => {
  return (
    <div className="home">
      <div className="content">
        <div className={"flex-column"}>
          <div className={"title"}>
            <h3>Profitability on the rise</h3>
          </div>
          <div className={"title"}>
            <h5>A trading platform that supports your financial goals.</h5>
          </div>
          <div>
            <button className={"button bg-primary"} onClick={props.toggleSidebar}
                    style={{ padding: "24px 36px" }}>
              <span style={{color: "#FFFFFF"}}>Start Trading -</span>
              <span style={{color: "#9CB0C2"}}> It's Free</span>
            </button>
          </div>
        </div>
      </div>
      <div className={"image"}>
        <img src="/assets/home_img_desktop.webp" alt="Desktop" style={{ height: '350px' }}/>
      </div>
    </div>
  );
}
