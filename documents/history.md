# 개발 히스토리

001. [개발환경 설정](./histories/001.md)
002. [Three.js Editor를 Typescript로 변환](./histories/002.md)
003. [GameObject와 Componnet 구조 설계](./histories/003.md)

----------------------------------------

오류 :
    스케일값을 변경하면 자식 오뷰젝트들이 모두 일그러진다.


에디터에 컴포넌트 추가하기

ObjectEditor.ts
    [ Add Component ] 공사중
    엔진 컴포넌트 추가
        UI에 Transform 표현하기
            현재 선택된 오브젝트의 UUID를 이용하여 GameObject를 얻는다.
            GameObject에서 포함된 Transform 객체를 얻는다.
            Transform을 표현한다.

        범용 컴포넌트 UI를 만들어낸다. ( 공사중 )
            boolean (완료)
            number, (완료)
            string, (완료)
            array, (완료)
            object, (완료)
            vector3,
            dictionary
            component link

        전용 컴포넌트 UI를 만든다. ( 공사중 )
            TransformEditor ( 완료 )
            MeshFilterEditor,
            MeshRendererEditor,


    프로젝트 컴포넌트 추가 (완료)

실행 모드

    이론
        새로운 씬을 만들고
            모든 오브젝트들을 로딩한다.
        종료하면 씬을 파괴한다.


        Scene에 ubjects 구조만들어야 한다. ( 완료 )
            Ubject.__ubjects => Scene.__ubjects  ( 완료 )

        Ubject 생성시 GamePlayer씬과 에디터씬들과 구분 지어야 한다.  ( 고민중....)
            현재는 액티브씬에 생성

            게임이 실행중일때는 무조건 GamePlayer씬에 생성
            실행을 중단하면 모두 삭제하고
            게임 실행중에 생성한 모든 객체들은 파괴된다.
            게임 실행중에 생성하거나 조작한 데이터들은 저장하지 않는다.
            에디터씬으로 복귀할때 씬을 다시 로딩한다.


        씬 교체해도 파괴되지 않는 오브젝트 구현
            새로운 글로벌 씬을 만들어 오브젝트를 이동시킨다.
                이동이 어려우면 실행할때부터 씬로딩시에 오브젝트를 글로벌씬에 생성한다.


    Time 클래스 수정중....





