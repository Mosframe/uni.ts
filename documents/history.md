# 개발 히스토리

001. [개발환경 설정](./histories/001.md)
002. [Three.js Editor를 Typescript로 변환](./histories/002.md)
003. [GameObject와 Componnet 구조 설계](./histories/003.md)

----------------------------------------

Ubject.serialize에서 null이면
 Util.serialize로 넘기는데
    scene.parent를 처리하는 과정에서 무한 루프가 걸린다.

Mesh.parnet = Scene
scene.childrun = Mesh


GameObject : B8155C99-6D40-495D-8B83-9CF7815ED061
              =>  D963F19E-DC07-4F12-956F-64DC998F5148

    components

    CCDE5E17-D984-4D96-9648-5A703A936B71



구현 원칙
클래스들은 리턴받아서 등록하지 말고
선행 등록을 해야한다.

우선순위 유지
객체 생성
module 등록
uuid 등록
class 등록


GameObject.transform 이 교체될때 Object._objects도 같이 교체한다.

그외에도 내부에 Ubject에서 상속받은 객체들이 교체될때는 모두 교체한다.
등록함수를 만들어둔다.
실수없이 항상 호출되도록 연구  : 현재는 uuid를 교체하면 된다.
avaliable를 제거한다.
