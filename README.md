# 會議管理系統

- 前端 (Vue3, typescript, tailwind)
- 後端 (Golang pocketbase)

## 需求

- 分為三個頁面
  - Sessions: session table
  - Attendee: attendee list
  - Speakers
- 管理者
  - （從 session table）新增 會議
    - 預設三日 day，(可由右下角 調整天數)
    - 每日分為上、下午時段，各時段可 同時舉辦二場會議 Site (可由右下角 調整數量)
    - 點擊空閒區間後，可新增會議：名稱、講者
    - 每位使用者都有唯一數字編號
    - 講者 每個時段只能參與一場會議，若衝突時段則 disable 按鈕
- 與會者
  - （從 attendee list）加入會議
    - 參加者被指定一個唯一的編號
    - 與會者 每個時段只能參與一場會議，若衝突時段則 disable 按鈕
- (模擬未來業務需求)
  - 天數可增減
  - 場地可稱減

### DB 架構

- sessions
  - id
  - day: integer 1/2/3 第幾天
  - slot: integer 1/2 時段
  - site: integer 1/2 場地
  - title: string (MySQL/Postgres/Mongodb)
  - speaker_id: relation
  - (max_attendees: integer)
- members 成員
  - id
  - name
- speakers 講者
  - id
  - members_id: relation
- attendees 每場會議的出席者
  - id
  - members_id: relation
  - session_id: relation
  - identifier: number 11010001 類似識別證

### TODO

- [x] 依序業務需求，考量擴展性、設計 DB schema
- [x] 使用 pocketbase 完成必要項目，包含 UI 邏輯、資料處理
- [] 改使用原生 golang API
