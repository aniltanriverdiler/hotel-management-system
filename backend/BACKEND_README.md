Kurulan Kütüphaneler Listesi(Beyza)
Installed Libraries List (Beyza)
-Express
-Socket.io

12 Ağustos (Beyza)
12 August (Beyza)
## Services Katmanı
## Services Layer

Projemizde `services/` klasörü, iş mantığını (business logic) controller’dan ayırmak amacıyla oluşturuldu.  
In our project, the `services/` directory was created to separate the business logic from the controller.
Burada;
Here, it contains:

- Veritabanı işlemleri,  
- Database operations,  
- Karmaşık hesaplamalar,  
- Complex calculations,  
- Yetkilendirme ve doğrulama işlemleri,  
- Authorization and validation processes,  
- Diğer iş süreçleri  
- Other business processes  

yer almaktadır.
These are located here.

Bu sayede kod daha modüler, okunabilir ve test edilebilir hale gelir.  
This makes the code more modular, readable, and testable.  
Controllerlar sadece HTTP istek ve yanıtlarını yönetirken, servisler asıl iş mantığını yürütür.
While controllers only handle HTTP requests and responses, services implement the main business logic.

Örnek olarak;  
For example;  
`hotelService.js` dosyasında otel oluşturma, listeleme ve güncelleme fonksiyonları bulunmaktadır.
In the `hotelService.js` file, there are functions for creating, listing, and updating hotels.
--------------------------------------------
## Tests Katmanı
## Tests Layer

`tests/` klasörü, projenin otomatik test dosyalarını içerir.  
The `tests/` directory contains the automated test files of the project.  
Bu testler sayesinde;
With these tests, we can verify that:

- Kodun doğru çalıştığı,  
- The code works correctly,  
- Fonksiyonların ve API endpointlerinin beklenen şekilde davrandığı,  
- The functions and API endpoints behave as expected,  
- Yeni yapılan değişikliklerin mevcut sistemi bozmadığı  
- New changes do not break the existing system  

kontrol edilir.
are validated.

Testler, hata ve sorunların erken tespit edilmesini sağlar ve geliştirme sürecinin kalitesini artırır.  
Tests help detect errors and issues early and increase the quality of the development process.  

Projede Jest, Mocha veya benzeri test araçları kullanılarak;  
In the project, Jest, Mocha or similar test tools are used to write:  
- Unit testler (bireysel fonksiyonlar),  
- Unit tests (individual functions),  
- Integration testler (modüllerin birlikte çalışması)  
- Integration tests (modules working together)  

yazılmıştır.
have been written.

Örnek test dosyaları:  
Example test files:  
- `auth.test.js` (kullanıcı doğrulama testleri)  
- `auth.test.js` (user authentication tests)  
- `hotel.test.js` (otel işlemleri testleri)  
- `hotel.test.js` (hotel operations tests)  
- `reservation.test.js` (rezervasyon işlemleri testleri)
- `reservation.test.js` (reservation operations tests)
------------------------------------------------------
## Support ve Chat Modülleri
## Support and Chat Modules

Proje kapsamında canlı destek ve sohbet sistemi için aşağıdaki modüller oluşturulmuştur:
Within the scope of the project, the following modules have been created for the live support and chat system:

### Support Modülü
### Support Module
- Müşteri destek taleplerinin yönetimi,  
- Management of customer support requests,  
- Destek taleplerinin oluşturulması, listelenmesi ve güncellenmesi,  
- Creation, listing, and updating of support requests,  
- REST API endpointleri `supportRoutes.js` dosyasında tanımlanmıştır.
- REST API endpoints are defined in the `supportRoutes.js` file.

### Chat Modülü
### Chat Module
- Gerçek zamanlı canlı sohbet ve mesajlaşma işlemleri,  
- Real-time live chat and messaging operations,  
- Socket.IO üzerinden anlık iletişim sağlanır,  
- Instant communication is provided via Socket.IO,  
- Mesajların modellenmesi `chatModel.js` ile yapılır,  
- Messages are modeled using `chatModel.js`,  
- REST API üzerinden bazı chat işlemleri varsa `chatRoutes.js` opsiyoneldir.
- If there are chat operations over REST API, `chatRoutes.js` is used optionally.

### Diğer Dosyalar
### Other Files
- `supportController.js` ve `chatController.js` iş mantığını yönetir,  
- `supportController.js` and `chatController.js` handle the business logic,  
- `authMiddleware.js` yetkilendirme için kullanılır,  
- `authMiddleware.js` is used for authorization,  
- `socketHandler.js` Socket.IO bağlantı ve event yönetimini sağlar.
- `socketHandler.js` manages Socket.IO connections and events.

Bu yapı sayesinde müşteri ve otel sahibi ile destek ekibi arasında etkili ve esnek iletişim sağlanmaktadır.
Thanks to this structure, effective and flexible communication is provided between the customer, the hotel owner, and the support team.
-------------------------------------------------------
## Ortam Değişkenleri (.env Dosyası)
## Environment Variables (.env File)

Proje, hassas bilgileri ve yapılandırma ayarlarını `.env` dosyası aracılığıyla yönetmektedir.  
The project manages sensitive information and configuration settings through the `.env` file.  
Bu dosyada aşağıdaki bilgiler yer alır:
The following information is stored in this file:

- **PORT:** Sunucunun çalışacağı port numarası.  
- **PORT:** The port number on which the server will run.  
- **DB_***: PostgreSQL veritabanı bağlantı bilgileri (host, port, kullanıcı, parola, veri tabanı adı).  
- **DB_***: PostgreSQL database connection information (host, port, user, password, database name).  
- **JWT_SECRET:** JSON Web Token için gizli anahtar.  
- **JWT_SECRET:** Secret key for JSON Web Token.  
- **EMAIL_***: E-posta gönderimi için SMTP ayarları (opsiyonel).  
- **EMAIL_***: SMTP settings for sending emails (optional).  
- **CLOUDINARY_***: Bulut tabanlı görsel yükleme için Cloudinary API bilgileri (opsiyonel).
- **CLOUDINARY_***: Cloud-based image upload Cloudinary API information (optional).

`.env` dosyasını projenin kök dizinine ekleyip, değerleri kendinize göre düzenlemelisiniz.  
You should add the `.env` file to the root directory of the project and configure the values according to your environment.  
Bu dosya `.gitignore` içinde yer almalı ve repoya gönderilmemelidir.
This file must be included in `.gitignore` and must not be pushed to the repository.
--------------------------------------------------------
14 Ağustos (Beyza) (server.js güncellendi)
14 August (Beyza) (server.js updated)
Socket.io ile gerçek zamanlı chat ve canlı destek sistemi kurulmuş, JWT ile kullanıcı doğrulaması yapılıyor.
A real-time chat and live support system has been established with Socket.io, and user authentication is performed with JWT.

Mesaj gönderme, chat join/leave, typing ve destek online/offline durumları yönetiliyor.
Message sending, chat join/leave, typing, and support online/offline statuses are being managed.

Sunucu PORT 5000 üzerinde çalışıyor ve hem API hem de socket bağlantıları aynı server üzerinden sağlanıyor.
The server is running on PORT 5000, and both API and socket connections are provided through the same server.
-----------------------------
15 Ağustos sunum yapıldı.
The presentation was done on 15 August.
---------------------------
16 Ağustos (Beyza)
16 August (Beyza)
 -->  chatServices.js kodlamaları güncellenecekk!!!!!!
 -->  chatServices.js implementations will be updated!!!!!!
 findOrCreateGeneralChat() → Genel destek odasını açar.
 findOrCreateGeneralChat() → Opens the general support room.

findOrCreatePrivateChat(customerId, hotelId) → Müşteri & otel sahibi için özel oda açar.
findOrCreatePrivateChat(customerId, hotelId) → Opens a private room for the customer & hotel owner.

getUserChats(userId, role) → Kullanıcının tüm sohbet odalarını listeler (müşteri, otel sahibi, destekçi farklı sonuç alır).
getUserChats(userId, role) → Lists all chat rooms of the user (customer, hotel owner, supporter receive different results).

getCounterpartIds(chatId, currentUserId) → Mesaj gönderildiğinde bildirim atılacak diğer kullanıcıların ID’lerini bulur.
getCounterpartIds(chatId, currentUserId) → Finds the IDs of other users who will receive notifications when a message is sent.
------------------------------------------
Eklenen /silinen tablolar 17 Ağustos 
Added / removed tables on 17 August
mevcut db deki support tablosu silindi,messages tablosu silindi 
The existing `support` table and the `messages` table in the current DB were deleted.
güncel Chat, ChatParticipant, Message modelleri eklendi 
The new Chat, ChatParticipant, and Message models were added.
-----------------------------------------
18 Ağustos (Beyza)
18 August (Beyza)
Bugün yapılanlar:
Today's work:

- Prisma güncellemesi yapıldı; eski client kaldırıldı, yeni Prisma Client generate edildi.
- Prisma was updated; the old client was removed and a new Prisma Client was generated.
- Message ve Chat servisleri şemaya uygun hâle getirildi:
- The Message and Chat services were aligned with the schema:
    - receiver ve receiver_id alanları Message modelinde olmadığı için koddan kaldırıldı.
    - The `receiver` and `receiver_id` fields were removed from the code because they do not exist in the Message model.
    - saveMessage ve getMessagesByChatId fonksiyonları buna göre güncellendi.
    - The `saveMessage` and `getMessagesByChatId` functions were updated accordingly.
- Chat testleri ve Message testleri yeniden düzenlendi; tüm testler başarıyla geçti.
- Chat tests and Message tests were reorganized; all tests passed successfully.
- Testlerde kullanılan kullanıcı ve chat temizleme işlemleri Prisma ile uyumlu hâle getirildi.
- The user and chat cleanup operations used in tests were made compatible with Prisma.
- Jest modülü eklendi ve test altyapısı hazırlandı.
- Jest module was added and the test infrastructure was prepared.
- package.json test script kısmı güncellendi; backend chat ve mesaj modülleri artık test edilebilir durumda.
- The test script part in package.json was updated; backend chat and message modules are now testable.
- server.js güncellendi; chat ve mesaj servisleri ile uyumlu hâle getirildi.
- server.js was updated and made compatible with the chat and message services.
-----------------------------------
19 Ağustos (Beyza)
Canlı destek için gerekli olan Controllers,models,routes,services yapıları kodlandı.
test klasöründe testler başarıyla sonuçlandı.
- Prisma client oluşturuldu ve DB bağlantı hataları giderildi
- AuthController register/login fonksiyonları test edildi, JWT üretildi
- Socket.io testleri eklendi (sahte ve gerçek JWT ile)
- dotenv testlerde kullanılacak şekilde yapılandırıldı

-------->pnpm komut satırı aracına geçildi----------
----------------------------------------------------------
21 Ağustos (Beyza)
Socket.io ile gerçek zamanlı chat bağlantısı sağlandı:
    - chat join
    - message send / receive
    - typing
    - notify:new-message
    - kullanıcı online/offline durumu güncelleme
- Postman testleri ile:
    - User ve Support oluşturuldu
    - Token bazlı mesaj gönderme/alma test edildi
    - 1-1 chat ve mesaj akışı çalışır durumda..

---------------------------------------------
25 Ağustos
- Socket.io `message:send` eventinde chatId ve senderId tip güvenliği eklendi (Number dönüşümü)
- Offline kullanıcı kontrolü ve notify sistemi güncellendi
- saveMessage fonksiyonunda NaN ve boş içerik kontrolü eklendi
- getMessagesByChatId fonksiyonunda cursor tip güvenliği sağlandı
- chat:join eventinde tip dönüşümü ve rol kontrolü iyileştirildi
- Kod okunabilirliği için değişken isimleri (chatIdNum vb.) optimize edildi
---------------------------------------
JWT token expiration süresi (`JWT_EXPIRES_IN=1h`) önemli ve eksikti, eklendi.

----------------------------------------------------
26 ağustos 
tüm api routes kısmı test edildi.
------------------------------------
27 Ağustos 
Kullanıcıların çevrimdışı durumlarına göre (support, hotel_owner) özel mesajlar eklendi.
Hata mesajları daha açıklayıcı hale getirildi.
"message:send" ve "chat:join" event'lerinde kullanıcı dostu geri bildirimler sağlandı.
Genel kod okunabilirliği ve güvenlik kontrolleri sağlandı.
Online/offline kontrolü ve rol bazlı offline bildirimler eklendi
--------------------------------------
28 Ağustos 
ufak hatalar düzeltildi.
userID=number(userId)
server.js deki support ve hotel_owner büyük harfe çevrildi. 
consola yazdırılan error hatası (messageController) düzeltildi.
-----------------------------------
Register: is_online default false olarak ayarlandı
Login: kullanıcı girişte is_online true oluyor
Logout & Socket disconnect: kullanıcı offline oluyor
Socket.io: console.log ile kullanıcı online/offline bilgisi gösteriliyor