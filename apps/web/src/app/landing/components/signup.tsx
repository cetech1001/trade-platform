export const Signup = () => {
  return (
    <div className={"flex-column"} style={{gap: "1rem", marginTop: "2rem"}}>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Name</span>
          <div className={'input-field'}>
            <input type={'text'} required/>
          </div>
        </div>
      </div>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Email</span>
          <div className={'input-field'}>
            <input type={'email'} required/>
          </div>
        </div>
      </div>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Password</span>
          <div className={'input-field'}>
            <input type={'password'} required/>
            <i className={"fa-solid fa-eye"}></i>
          </div>
        </div>
      </div>
      <button className={"button bg-primary"}>Login</button>
    </div>
  );
};
