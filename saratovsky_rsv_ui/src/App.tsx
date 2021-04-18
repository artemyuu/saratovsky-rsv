import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import ButtonStart from "./rsv_app/components/ButtonStart/ButtonStart";
import Tmp from "./rsv_app/components/tmp/Tmp";
import "./style.css";
import { ChatHelper } from "./chatHelper";
import ButtonLogin from "./rsv_app/components/ButtonLogin/ButtonLogin";

interface Button {
  title: string;
  description: string;
  step: number;
}

const buttons: Array<Button> = [];

const buttonCycled = (current: number): number => {
  if (current + 1 > buttons.length - 1) {
    return current;
  }
  return current + 1;
};

function App() {
  const buttonStartSrting = "Экскурс по сайту"; // Должно приходить с бека (редачится в админке)

  const [isLearning, setIsLearning] = useState<boolean>(false);
  const [button, setButton] = useState<number>(-1);

  const [isUserLogined, setIsUserLogined] = useState<boolean>(false); // TODO: ОТ ЭТОГО зависит содержание первого сообщения
  const [isAdminLogined, setIsAdminLogined] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/start-learning")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          let item = response.data[i];
          buttons.push({
            title: item.title,
            description: item.description,
            step: item.step,
          });
        }

        buttons.sort((a, b) => {
          if (a.step > b.step) return 1;
          if (a.step == b.step) return 0;
          return -1;
        });

        console.log(buttons);

        current = buttons[0];
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    globalThis.addEventListener("load", (event) => {
      console.log(window.location.href);
    });
  }, []);

  useEffect(() => {
    const Helper = new ChatHelper("#chatHelper", {});
  }, []);

  const startLearning = (value: boolean): void => {
    setIsLearning(value);
  };

  let current: Button = buttons[button];

  return (
    <BrowserRouter>
      <div id="chatHelper"></div>
      <div className={"wrapper " + (isLearning ? "blocked" : "")}>
        <div className={"wrapper_content"}>
          <div className={"content"}>
              <ButtonLogin
                  loginAsUser={(value: boolean) => setIsUserLogined(value)}
                  loginAsAdmin={(value: boolean) => setIsAdminLogined(value)}
              />
            <ButtonStart
              text={buttonStartSrting}
              startLearning={() => {
                startLearning(true);
                setButton(0);
              }}
            />
              { isAdminLogined &&
                  <div>Редактировать</div>
              }
          </div>

          <Tmp currentId={button} />

          {isLearning && (
            <div className={"learning"}>
              <div className={"info"}>
                <div className="title">{current.title}</div>
                <div className="desc">{current.description}</div>
                <div
                  className={"button-learning"}
                  onClick={() => {
                    if (button == buttons.length - 1) {
                      startLearning(false);
                      setButton(-1);
                    } else {
                      setButton(buttonCycled(button));
                    }
                  }}
                >
                  {button == buttons.length - 1 ? "Завершить" : "Далее"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;