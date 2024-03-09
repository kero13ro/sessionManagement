# 會議管理系統

- 後端(Golang)
- 前端(Vue3)
  - tailwind

## 需求

- 分為二個頁面
  - Sessions: session table
  - Attendee: attendee list
- 管理者
  - （從 attendee list）新增 與會者、講者列表：id 和名稱
  - （從 session table）新增 會議
    - (初步設計：固定三日)
    - 每日分為上、下午時段 am/pm，每時段可同時舉辦二會議
    - 點擊空閒區間後，可新增會議：名稱、一位講者、多位與會者、上限人數
    - 每位使用者都有唯一數字編號
- 與會者
  - （從 attendee list）加入會議
    - 講者、與會者 每個時段只能參與一場會議
    - 達到上限禁止加入 disable the “+ join” button

### DB 架構

- Session
  - id
  - date: integer 1/2/3（初步設計，可擴展為行事曆）
  - section: enum am/pm
  - site: string
  - title: enum MySQL/Postgres/Mongodb
  - speaker_id: integer
  - max_attendees: integer
- Attendees
  - id
  - identifier: unique number
  - name
  - speaker_id
- Speakers
  - id
  - desc: string
- AttendeeSessionMapping
  - id
  - attendee_id
  - session_id
