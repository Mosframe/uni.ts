# 개발 히스토리

001. [개발환경 설정](./histories/001.md)
002. [Three.js Editor를 Typescript로 변환](./histories/002.md)
003. [GameObject와 Componnet 구조 설계](./histories/003.md)

----------------------------------------


ObjectEditor.ts
    [ Add Component ] 공사중
    엔진 컴포넌트 추가
        UI에 Transform 표현하기
            현재 선택된 오브젝트의 UUID를 이용하여 GameObject를 얻는다.
            GameObject에서 포함된 Transform 객체를 얻는다.
            Transform을 표현한다.

        범용 컴포넌트 UI를 만들어낸다.
            boolean
            number,
            string,
            vector3,
            array,
            dictionary
            component link

        전용 컴폰넌트 UI를 만든다.
            Transform
            MeshFilter,
            MeshRenderer,



    프로젝트 컴포넌트 추가
