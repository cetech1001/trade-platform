interface IProps {
  toggleSidebar(): void;
}

export const Home = (props: IProps) => {
  return (
    <div className="home">
      <div className={'image'}>
        <div className="logo-wrap">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANcAAABGCAMAAABomfFhAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABFUExURUdwTP///////////////////////////////////////////////////////////////wzj1Q3i1w3j1Qrk1P///w3j1hVW9ZcAAAAVdFJOUwC/EDBAn+8g32CAcM+Qr1CP316AMOZCNT8AAAYESURBVGje7ZvrlqQoDICLawAtdXbHef9HXS1RCYSL9vSZ7tnKnzklDuQjEBJiPx4Z+ffXS348/jJ5c/2vuECOoxR/FxfvmJ436ZWMW+VMCxA9sa1J89xQBnVh2CQ/j2vUeLAJ7nLB3mbbuF7D2U/icslQurvJpfY21s41zwMvqffzn02uYnXESOoeF5yN8gIXNQsCcvrmW7AuuqZyO5c9G59XuOYuUV6bjPr5FloX83Ru9x4K92S87G96gZLSOc/hXxnUKoe3it8WSwOtfr4lksEru/UsVc7THavMVKfoJa7IJaO9LRPlafXzLbH0kYnAGvW4x7U5ebMZQTdxPZ7EshXejKn6+ZYclz7fBH6PS3gX/yx5jphLpitfHDs+Vj/fkl2Hs3G1V2tcym8VWXL1MRdPXuaBI8Pqi7CFt7t51okPcMEx81530cIFqb3YTIOFWFl/S07P0o+Cu1zdobEreI6Yy6ZqopPnBENYVXOlxxODe1zmaOUFVx9xcf97zEYKOxjCmlsCdBGfle4Olw0CQ5Y5bWOuxfeSZ/yQgmEs1xbOO1M5/hu4WKBgwXPQ8YYq7g2IsUxzkCiVqaUgZS6BFNRZV09yJV5bRs0Ya4bHBREdK3ubIpeP5C28ZPLRUhuXTnfLE4Pp+foqDDqFPc/or3IBHRrzFi5DOAFu5qy0rUKJ8Fldd9Oa7JAza9ry7mwSgSKjkjCUsbqbXJnp1cV43k/iROr1zHF1jebacnFA5r+6Dm1OCVny81wXIsncShwerebyTnnq7KRv+g2W42LF88uVggcxN7nOtmDjnp8X+w3MKS5jMMS1GyxdidxOfWamprEeQz3AtG33MpciTteetjyOoxwVFoFVBW+4XQaOVbM5Uzv9q1xAWdnRQSLm2jcROw9RpecmMcqWg0SIyHR3Ne6dqL3EadtHca89nRyX5+1so+ihnFmN6ljMzPHLeYoh70IZ6VrjPMUch9JFprkUQgTTK8dlt4viltxiJGh8zsnH/iGP3+KPe1gXYuA/JG+uN9eb68315kJ3B7/5/PoCIuxgLtpKWXh8C4Eg9KnY6Wn541sJH5+sHBYyJ78Z05kYOjoIXkJd2TI3MpF1JuD4lYkYRfKpR9ADFIcA/IxfSw1Nm6EsnSurcCFbskAeJVaAJ9XmU3IbDZsrdWTW4tTENfpascZlYzXroKacZmQqSaxW0rOv8I5Lnl2/ZNy4wpcVYQTXfBVUsRsgvc8Mdq0NuOSuqI8MBkH+xUcVTKwkrkuC4bhdHGDPGy9a21dijWsZoo8nyS6da5xHAs4rYTiuEypcm2mmxgvJCzdtVa712ohFg9pFGVbgCpStc613oLy0CvWdm9E61zoKRy8vaTvHRky41iIWNHKJWFeI6hL2zk12nUvgmzDzWmIDeiflWqz8bORaenzmV+FabrG1745ucQGyjVdUoocp17K6Xq6lhavHd3tTWkWy91Zi1V4yPFiU/5cVuTz4dS5JFcfsrZVY5rLh/jqMhxQmuPg2rw1cgCyAAo2z5mfvZCdlLhP2c7aFu4LgWtpdGm9Qwzn0U2VKmS2fX13icqHOAUAXnM0f4RLo6jwsEOEKrb2eJhe4JEPVA3V2uXg8V+LSO5eEU5LhuIuqP+c6jAvP9mq5KOXSapNB46IIhHGGOw1GcMH2uUlmfw2+/xWiBzKST+vp9iJWyhWWV8Lzt1u2+FHk6s79TnDZ4zyAYhrRWzpFIT4T8P+xGSvl6nfdNY7dTOY6iODy3ibDtc9OTwWyK5gWucTK/I54o0Nn1/KeCmQ4GlMu659U/DxoKqUCo0VO0wtYJb8xhBNqoqLfcTYnXEJ7W9bOrzH66sv3d2DF35mPV66gClyL3x1yccIZTMVcUu9BQfVcfpbDhw/9fUrp/JKnd2BJyLk/wVzr58/7QqpyLRPH/gTXOaEyXTLWh/oLl9q95KvsfXzGKEMPusiYDCeLgezncfHex1EqPeb3bCTK25nM3tsYMq8Un8M1MhZ6W6dQ/CXYsOrJGUt3eMdeuw/YIQrfxAqGZXU844CvahRzn8P1heXN9SXlP+LGQEJRVZgIAAAAAElFTkSuQmCC"
            className="logo"
            alt={'Logo'}
          />
          <p>AIM HIGH, REACH HIGH</p>
        </div>
        <img
          src="/assets/images/astronaut.png"
          alt="Astronaut"
          className="astronaut"
        />
      </div>
      <div className="content">
        <div className={"form-box"}>
          <h4>Client Portal Login</h4>
          <div className={"tabs"}>
            <div className={"tab active"}>
              <span>Login</span>
              <div className={"active-block"}></div>
            </div>
            <div className={"tab"}>
              <span>Register</span>
              <div className={"active-block"}></div>
            </div>
          </div>
          <div>
            <label>* Email</label>
            <input type={"email"} className={"input"} name={"email"} required/>
          </div>
          <div>
            <label>* Password</label>
            <input type={"password"} className={"input"} name={"email"} required/>
          </div>
        </div>
      </div>
    </div>
  );
}
