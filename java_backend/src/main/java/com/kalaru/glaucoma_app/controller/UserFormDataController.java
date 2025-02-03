package com.kalaru.glaucoma_app.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.util.MultiValueMap;

import java.io.IOException;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1")
public class UserFormDataController {

    private static final Logger logger = LoggerFactory.getLogger(UserFormDataController.class);

    @PostMapping("/submit")
    public ResponseEntity<String> handleFormData(
        @RequestParam(value = "leftImage", required = false) MultipartFile leftImage,
        @RequestParam(value = "rightImage", required = false) MultipartFile rightImage,
        @RequestParam("data") String data) {

        logger.info("Received data: " + data);

        try {
            // Parse JSON data
            UserFormData userFormData = new Gson().fromJson(data, UserFormData.class);

            // Validate images
            if (leftImage == null || rightImage == null) {
                return ResponseEntity.badRequest().body("Both images are required.");
            }

            logger.info("Received leftImage: " + leftImage.getOriginalFilename());
            logger.info("Received rightImage: " + rightImage.getOriginalFilename());

            // Set filenames in object
            userFormData.setLeftImage(leftImage.getOriginalFilename());
            userFormData.setRightImage(rightImage.getOriginalFilename());

            // Send data to Python backend
            RestTemplate restTemplate = new RestTemplate();
            String pythonBackendUrl = "http://localhost:5000/predict";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("data", data);
            body.add("leftImage", new ByteArrayResource(leftImage.getBytes()) {
                @Override
                public String getFilename() {
                    return Objects.requireNonNull(leftImage.getOriginalFilename());
                }
            });
            body.add("rightImage", new ByteArrayResource(rightImage.getBytes()) {
                @Override
                public String getFilename() {
                    return Objects.requireNonNull(rightImage.getOriginalFilename());
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(pythonBackendUrl, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Data sent successfully to Python backend");
                return ResponseEntity.ok(response.getBody()); // Return the response body from Python backend
            } else {
                logger.error("Failed to send data to Python backend: " + response.getStatusCode());
                return ResponseEntity.status(response.getStatusCode()).body("Failed to send data");
            }

        } catch (IOException e) {
            logger.error("Error processing files: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File processing error");
        } catch (Exception e) {
            logger.error("Error processing request: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request data");
        }
    }
}
