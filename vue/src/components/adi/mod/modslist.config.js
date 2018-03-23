import ModHeader from './web/header'
import ModTitle from './web/title'
import ModBoard from './web/board'
import ModText from './web/text'

var modsList = [
  {
    id: 1,
    label: '全部',
    mods: [ModHeader, ModTitle, ModBoard, ModText]
  },
  {
    id: 2,
    label: '常用',
    children: [
      {
        id: 3,
        label: '测试',
        mods: []
      }
    ]
  }
]
export default modsList
