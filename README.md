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
    - 每日分為上、下午時段，每時段可同時舉辦二會議
    - 點擊空閒區間後，可新增會議：名稱、一位講者、多位與會者、上限人數
    - 每位使用者都有唯一數字編號
- 與會者
  - （從 attendee list）加入會議
    - 講者、與會者 每個時段只能參與一場會議
    - 參加者被指定一個唯一的編號 A0001
    - 達到上限禁止加入 disable the “+ join” button
- 擴展性：模擬未來業務需求
  - 天數可增減
  - 場地可稱減

### DB 架構

- sessions
  - id
  - day: integer 1/2/3（初步設計，可擴展為行事曆）
  - slot: integer 1/2 (am/pm)
  - site: integer 1/2 (場地 A/場地 B)
  - title: string (MySQL/Postgres/Mongodb)
  - speaker_id: integer
  - (max_attendees: integer)
- members 成員
  - id
  - name
- speakers 講者
  - id
  - desc: string
  - members_id
- attendees 出席者
  - id
  - members_id
  - session_id
  - identifier: number 11010001 識別證
    - Q. 需求書寫 unique number，但範例是 A0001?

### 討論

- identifier: unique number
  - Q. 但是 範例是 A0001?

### TODO

- 完成 MVP，必要需求項目，包含 UI 邏輯、資料處理
- 依序業務需求，考量擴展性、設計 DB schema
- 改使用原生 golang API
