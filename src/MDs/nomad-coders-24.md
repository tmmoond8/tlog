---
title: 24 우버 클론 코딩 (nomad coders)
date: '2019-06-07T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.39 ~ 2.40
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Clone Coding'
  - 'Nomad Coder'
  - Apollo
  - GraphQL
---
#

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #2.39 Uploading Profile Photo to Cloudinary part One (1)

이번에는 이미지 파일을 수정하는 것인데, 지금까지 프로필은 facebook을 통해 url을 통해 이미지를 가져왔다. 마찬가지로 url을 통해서 이미지를 수정하게 해줄 거다. 다만 이미지를 저장하는 저장소가 있어야 하는데, 니콜라스가 간단한 서비스를 소개해줬다.

[https://cloudinary.com/](https://cloudinary.com/) 무료로 이미지 저장소는 어느 정도 사용할 수 있나보다.

먼저 프로필 변경 컴포넌트를 생성하자.

- src/components/PhotoInput/PhotoInput.tsx

        import React from "react";
        import styled from "../../typed-components";
        
        const Container = styled.div``;
        
        const Image = styled.label`
          display: flex;
          align-items: center;
          justify-content: center;
          height: 80px;
          width: 80px;
          margin-bottom: 35px;
          border: 2px solid black;
          border-radius: 50%;
          font-size: 28px;
          cursor: pointer;
          overflow: hidden;
          & img {
            width: 80px;
            height: 80px;
          }
        `;
        
        const Input = styled.input`
          visibility: hidden;
          height: 1px;
          opacity: 0;
          &:focus {
            outline: none;
          }
        `;
        
        interface IProps {
          uploading: boolean;
          photoUrl: string;
          onChange: React.ChangeEventHandler<HTMLInputElement>;
        }
        
        const PhotoInput: React.SFC<IProps> = ({ uploading, photoUrl, onChange }) => (
          <Container>
            <Input id="photo" type="file" accept="image/*" onChange={onChange}/>
            <Image htmlFor="photo">
              {uploading && "⏰"}
              {!uploading && <img src={photoUrl}/>}
            </Image>
          </Container>
        )
        
        export default PhotoInput;

- src/components/PhotoInput/index.ts

        export { default } from "./PhotoInput";

EditAccountPresenter에서 위 컴포넌트를 불러서 이미지를 넣자.

- src/routes/EditAccount/EditAccountPresenter.tsx   PhotoInput 컴포넌트를 불러왔다.

        import Input from "components/Input";
        import PhotoInput from "components/PhotoInput";
        import React from "react";
        ...
        interface IProps {
          ...
          uploading : boolean;
        }
        ...
          onInputChange,
          loading,
          uploading
        }) => (
          <Container>
            <Helmet>
              <title>Edit Account | Nuber</title>
            </Helmet>
            <Header title="Edit Account" backTo={"/"}/>
            <ExtendedForm submitFn={onSubmit}>
              <PhotoInput 
                uploading={uploading}
                photoUrl={profilePhoto}
                onChange={onInputChange}
              />
              <ExtendedInput
                onChange={onInputChange}
                type="text"
                value={firstName}
                placeholder="First Name"
                name="firstName"
              />
        ...

- src/routes/EditAccount/EditAccountContainer.tsx   `uploading` 속성을 추가

        ...
        
        interface IState {
        	...
          uploading: boolean;
        }
        
        ...
        
        class EditAccountContainer extends React.Component<IProps, IState> {
          public state = {
            ...
            uploading: false,
          };
        
          public render() {
            const { email, firstName, lastName, profilePhoto, loading, uploading } = this.state;
            ....
                    {(updateProfileMutation, { loading: updateLoading }) => (
                      <EditAccountPresenter
                        ...
                        uploading={uploading}
                      />
                    )}
                  </UpdateProfileMutation>
                )}
              </ProfileQuery>
            );
          }
        ...

이제 photo형식의 Input이 되었다. 클릭하면 파일 선택을 할 수 있다.

물론 아직까지는 사진을 저장하여 사용할 수 없다. 이어서 사진을 저장하고 저장한 위치를 url로 받아서 update하도록 하자.

## #2.39 Uploading Profile Photo to Cloudinary part One(2)

[https://cloudinary.com/](https://cloudinary.com/) 가서 회원 가입을 하자. 회원 가입하면 대시보드에 api키를 볼 수 있다.

이미지 업로드는 apollo-boost를 사용하지 않고 외부 요청을 해야 하기 때문에, http 통신 모듈인 axios를 설치하자.

    $ yarn add axios
    $ yarn add @types/axios --dev

- src/routes/EditAccount/EditAccountContainer.tsx   Input 태그 중 파일에 대한 처리를 추가 했다. api 키는 대시보드에 있는 값을 사용하면 되고, `upload_preset`과 API URL 은 대시보드에서 확인해야 한다. upload_preset은 setting - upload 쪽에 있고, API URL 대시보드에서 메뉴를 펼치면 있다. 동기적인 코드를 만들기 위해서 `async`, `await`를 사용했다.

        import axios from "axios";
        import React from "react";
        ...
          public onInputChange: React.ChangeEventHandler<HTMLInputElement> = async event => {
            const {
              target: { name, value, files }
            } = event;
        
            if (files) {
              this.setState({
                uploading: true
              });
              const formData = new FormData();
              formData.append("file", files[0]);
              formData.append("api_key", "발급 받은 api 키");
              formData.append("upload_preset", "xtaoaopp");
              formData.append("timestamp", String(Date.now() / 1000));
              const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dgggcrkxq/image/upload",
                formData
              );
              console.log(response);
            }
        
            this.setState({
              [name]: value
            } as any);
          };
        
         ...

setting - upload

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952572/tlog/_2019-05-17__6-06b9f71a-9908-49c9-ba29-65403a66b861.54.55_ojyzfn.png)

대시 보드에서 Environment variable를 펼치고 API Base URL 을 펼치면 보인다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952572/tlog/_2019-05-17__6-a6b5dd50-4191-4a10-9eb5-e736df4fa69e.53.48_cntgux.png)

아까 업로드 완료 후 response를 출력하도록 했다. 다음 처럼 값이 나오고, data 안에는 업로드 완료된 이미지의 주소가 있다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952572/tlog/_2019-05-17__7-cd6ccb11-4110-4f35-a68b-4dc0e54b5ab9.14.04_cuyhoz.png)

## #2.40 Uploading Profile Photo to Cloudinary part Two

거의 다 됐다. 이번에는 업로드한 주소를 이용하여 값을 넣어주고 프로필을 업데이트까지 해보자.

- src/routes/EditAccount/EditAccountContainer.tsx

        ...
            if (files) {
              this.setState({
                uploading: true
              });
              const formData = new FormData();
              formData.append("file", files[0]);
              formData.append("api_key", "발급 받은 api 키");
              formData.append("upload_preset", "xtaoaopp");
              formData.append("timestamp", String(Date.now() / 1000));
              const {
                data: { secure_url }
              } = await axios.post(
                "https://api.cloudinary.com/v1_1/dgggcrkxq/image/upload",
                formData
              );
              if (secure_url) {
                this.setState({
                  profilePhoto: secure_url,
                  uploading: false
                })
              }
            }
        
            this.setState({
              [name]: value
            } as any);
          };
        ...

이렇게 수정하고 프로필 사진을 바꾸고 프로필 업데이트 하자. 그리고 메뉴에서도 업데이트된 프로필 사진이 잘 변경됐는지 보자.

니콜라스가 간단하게 이미지를 저장하고 불러오는 방법을 제시했다. 이 방법은 정말 좋은 것같다. 다만, 가격정책이 어떤지는 잘 모르겠다.